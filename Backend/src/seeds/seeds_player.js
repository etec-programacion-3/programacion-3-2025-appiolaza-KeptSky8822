const { Player, Team } = require('../models');

const seedPlayers = async () => {
  try {
    // First, seed the teams if they don't exist
    const teamsData = [
      { name: 'Aston Villa', country: 'England', city: 'Birmingham' },
      { name: 'Tottenham Hotspur', country: 'England', city: 'London' },
      { name: 'Atlético de Madrid', country: 'Spain', city: 'Madrid' },
      { name: 'Inter Miami', country: 'USA', city: 'Miami' },
      { name: 'Benfica', country: 'Portugal', city: 'Lisbon' },
      { name: 'Chelsea', country: 'England', city: 'London' },
      { name: 'Manchester City', country: 'England', city: 'Manchester' },
      { name: 'Liverpool', country: 'England', city: 'Liverpool' }
    ];

    // Check if teams already exist, if not create them
    for (const teamData of teamsData) {
      const existingTeam = await Team.findOne({ where: { name: teamData.name } });
      if (!existingTeam) {
        await Team.create(teamData);
        console.log(`✅ Team ${teamData.name} created`);
      }
    }

    // Get team IDs
    const astonVilla = await Team.findOne({ where: { name: 'Aston Villa' } });
    const tottenham = await Team.findOne({ where: { name: 'Tottenham Hotspur' } });
    const atletico = await Team.findOne({ where: { name: 'Atlético de Madrid' } });
    const interMiami = await Team.findOne({ where: { name: 'Inter Miami' } });
    const benfica = await Team.findOne({ where: { name: 'Benfica' } });
    const chelsea = await Team.findOne({ where: { name: 'Chelsea' } });
    const manCity = await Team.findOne({ where: { name: 'Manchester City' } });
    const liverpool = await Team.findOne({ where: { name: 'Liverpool' } });

    // Datos de ejemplo — podés ajustarlos a tus equipos reales
    const players = [
      {
        first_name: 'Emiliano',
        last_name: 'Martínez',
        display_name: 'Dibu Martínez',
        date_of_birth: '1992-09-02',
        nationality: 'Argentina',
        position: 'goalkeeper',
        detailed_position: 'GK',
        jersey_number: 23,
        height: 195,
        weight: 88,
        foot: 'right',
        market_value: 25000000,
        contract_until: '2028-06-30',
        photo_url: 'https://example.com/players/dibu.jpg',
        status: 'active',
        team_id: astonVilla.id
      },
      {
        first_name: 'Cristian',
        last_name: 'Romero',
        display_name: 'Cuti Romero',
        date_of_birth: '1998-04-27',
        nationality: 'Argentina',
        position: 'defender',
        detailed_position: 'CB',
        jersey_number: 17,
        height: 185,
        weight: 80,
        foot: 'right',
        market_value: 60000000,
        contract_until: '2027-06-30',
        photo_url: 'https://example.com/players/romero.jpg',
        status: 'active',
        team_id: tottenham.id
      },
      {
        first_name: 'Rodrigo',
        last_name: 'De Paul',
        date_of_birth: '1994-05-24',
        nationality: 'Argentina',
        position: 'midfielder',
        detailed_position: 'CM',
        jersey_number: 7,
        height: 180,
        weight: 72,
        foot: 'right',
        market_value: 35000000,
        contract_until: '2026-06-30',
        photo_url: 'https://example.com/players/depaul.jpg',
        status: 'active',
        team_id: atletico.id
      },
      {
        first_name: 'Lionel',
        last_name: 'Messi',
        display_name: 'Leo Messi',
        date_of_birth: '1987-06-24',
        nationality: 'Argentina',
        second_nationality: 'España',
        position: 'forward',
        detailed_position: 'RW',
        jersey_number: 10,
        height: 169,
        weight: 67,
        foot: 'left',
        market_value: 3000000,
        contract_until: '2025-12-31',
        photo_url: 'https://example.com/players/messi.jpg',
        status: 'active',
        team_id: interMiami.id
      },
      {
        first_name: 'Ángel',
        last_name: 'Di María',
        display_name: 'Fideo',
        date_of_birth: '1988-02-14',
        nationality: 'Argentina',
        position: 'forward',
        detailed_position: 'RW',
        jersey_number: 11,
        height: 180,
        weight: 75,
        foot: 'left',
        market_value: 2000000,
        contract_until: '2025-06-30',
        photo_url: 'https://example.com/players/dimaria.jpg',
        status: 'active',
        team_id: benfica.id
      },
      {
        first_name: 'Enzo',
        last_name: 'Fernández',
        date_of_birth: '2001-01-17',
        nationality: 'Argentina',
        position: 'midfielder',
        detailed_position: 'CM',
        jersey_number: 8,
        height: 178,
        weight: 76,
        foot: 'right',
        market_value: 80000000,
        contract_until: '2031-06-30',
        photo_url: 'https://example.com/players/enzo.jpg',
        status: 'active',
        team_id: chelsea.id
      },
      {
        first_name: 'Julián',
        last_name: 'Álvarez',
        date_of_birth: '2000-01-31',
        nationality: 'Argentina',
        position: 'forward',
        detailed_position: 'ST',
        jersey_number: 19,
        height: 174,
        weight: 70,
        foot: 'right',
        market_value: 90000000,
        contract_until: '2028-06-30',
        photo_url: 'https://example.com/players/julian.jpg',
        status: 'active',
        team_id: manCity.id
      },
      {
        first_name: 'Alexis',
        last_name: 'Mac Allister',
        date_of_birth: '1998-12-24',
        nationality: 'Argentina',
        position: 'midfielder',
        detailed_position: 'CM',
        jersey_number: 10,
        height: 176,
        weight: 72,
        foot: 'right',
        market_value: 55000000,
        contract_until: '2028-06-30',
        photo_url: 'https://example.com/players/macallister.jpg',
        status: 'active',
        team_id: liverpool.id
      }
    ];

    await Player.bulkCreate(players, { validate: true });
    console.log('✅ Jugadores insertados correctamente');
  } catch (error) {
    console.error('❌ Error al insertar jugadores:', error);
  }
};

module.exports = seedPlayers;

// Si querés ejecutarlo directamente con `node src/seeds/seeds_players.js`
if (require.main === module) {
  const { sequelize } = require('../models');
  sequelize.sync({ force: false }).then(() => {
    seedPlayers().then(() => process.exit());
  });
}
