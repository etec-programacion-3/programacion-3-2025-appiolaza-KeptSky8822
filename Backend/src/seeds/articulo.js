// src/seeds/20251110-seed-real-news.js
const { Article, MediaGallery } = require('../models');

const news = [
  {
    title: "Se confirmó la sede: el Leipzig-Liverpool se jugará en Budapest",
    content: "La RB Leipzig y el Liverpool FC disputarán su enfrentamiento en la UEFA Champions League en Budapest, tras confirmarse que la ciudad húngara será la sede del partido. Una decisión que responde a las restricciones de entrada en Alemania y al impacto logístico para ambos clubes.",
    media: [
      {
        type: "image",
        url: "https://media.tycsports.com/files/2021/02/07/176500/puskas_862x485.jpg",
        description: "Estadio Puskás Arena de Budapest, sede del encuentro"
      }
    ]
  },
  {
    title: "Leo Messi en el nuevo Camp Nou junto a su visita sorpresa",
    content: "Lionel Messi visitó el renovado Spotify Camp Nou y sorprendió con una foto junto a un compañero tras pasear por el césped. Su presencia generó gran repercusión entre los aficionados y la directiva del club blaugrana.",
    media: [
      {
        type: "image",
        url: "https://media.tycsports.com/files/2025/11/10/900683/leo-messi-en-el-nuevo-camp-nou_862x485.webp?v=1",
        description: "Messi en el césped del Camp Nou renovado"
      }
    ]
  },

  {
    title: "Lucas Chevalier dio una explicación llamativa tras ser acusado de actitudes fascistas en PSG vs Lyon",
    content: "Lucas Chevalier respondió a las acusaciones sobre supuestas actitudes polémicas durante el enfrentamiento entre PSG y Olympique Lyon. En su explicación, el arquero negó cualquier intención provocadora y pidió enfocarse en el partido y el desempeño del equipo.",
    media: [
      {
        type: "image",
        url: "https://img.asmedia.epimg.net/resizer/v2/YJDSW64ZABFJTEKQKDB2A63IOI.jpeg?auth=2def9d6dddade0d03f8782fac8a9c72dac8a75b684f877c2a3b66708075b8af5&width=1200&height=675&focal=337%2C158",
        description: "Lucas Chevalier durante el partido PSG vs Lyon"
      }
    ]
  }
];

async function seedRealNews() {
  try {
    console.log('🚀 Importando noticias reales de fútbol...');
    for (const n of news) {
      const article = await Article.create({
        title: n.title,
        content: n.content
      });
      console.log(`📰 Artículo creado: "${n.title}"`);

      for (const m of n.media) {
        await MediaGallery.create({
          article_id: article.id,
          type: m.type,
          url: m.url,
          description: m.description
        });
        console.log(`   📸 Medio agregado: ${m.url}`);
      }
    }
    console.log('\n✅ Seed de noticias reales completada!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error importando noticias:', err);
    process.exit(1);
  }
}

seedRealNews();
