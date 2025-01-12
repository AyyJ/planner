const connectDB = require('./config/database');
const Artist = require('./models/Artist');

const seedArtists = async () => {
    try {
        await connectDB();
        
        await Artist.deleteMany({}); // Clear existing artists
        
        await Artist.insertMany([
            {
                name: 'Bad Bunny',
                genre: 'Latin Pop',
                stage: 'coachella'
            },
            {
                name: 'Blur',
                genre: 'Rock',
                stage: 'outdoor'
            },
            {
                name: 'Lana Del Rey',
                genre: 'Pop',
                stage: 'coachella'
            }
        ]);
        
        console.log('Database seeded!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedArtists();
