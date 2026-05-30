const API_URL = 'http://localhost:5193/api';

const dummyUser = {
  name: 'John Doe',
  dob: '1990-01-01',
  address: '123 Dummy St, Dummy City',
  mobile: '1234567890',
  email: 'johndoe@example.com',
  password: 'Password123!',
  gender: 'Male'
};

const dummySchedules = [
  { taskName: 'Morning Workout', time: '07:00' },
  { taskName: 'Team Standup', time: '09:30' },
  { taskName: 'Code Review', time: '11:00' },
  { taskName: 'Lunch Break', time: '13:00' },
  { taskName: 'Feature Development', time: '14:00' },
  { taskName: 'Sync with Manager', time: '16:30' },
  { taskName: 'Wrap up and Email replies', time: '17:30' },
  { taskName: 'Evening Walk', time: '19:00' }
];

async function seedData() {
  try {
    console.log('Registering dummy user...');
    let res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dummyUser)
    });
    
    // Ignore if already registered
    if (!res.ok && res.status !== 400) {
      console.error('Failed to register', await res.text());
      return;
    }

    console.log('Logging in...');
    res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: dummyUser.email, password: dummyUser.password })
    });

    if (!res.ok) {
      console.error('Failed to login', await res.text());
      return;
    }

    const { token } = await res.json();
    console.log('Logged in successfully. Token acquired.');

    console.log('Creating schedules...');
    const scheduleIds = [];
    for (const schedule of dummySchedules) {
      res = await fetch(`${API_URL}/schedule`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(schedule)
      });
      if (res.ok) {
        const data = await res.json();
        scheduleIds.push(data.id);
        console.log(`Created schedule: ${schedule.taskName} at ${schedule.time}`);
      } else {
        console.error(`Failed to create schedule ${schedule.taskName}`, await res.text());
      }
    }

    console.log('Marking a few tasks as completed...');
    // Mark the first two as completed
    for (let i = 0; i < 2; i++) {
      if (scheduleIds[i]) {
        res = await fetch(`${API_URL}/tasks/complete`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ templateId: scheduleIds[i] })
        });
        if (res.ok) {
          console.log(`Marked task ID ${scheduleIds[i]} as completed.`);
        }
      }
    }

    console.log('\n--- Data Seeding Complete ---');
    console.log(`Email: ${dummyUser.email}`);
    console.log(`Password: ${dummyUser.password}`);

  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

seedData();
