// src/seeds/20251108-seed-real-news.js
const { Article, MediaGallery } = require('../models');

const news = [
  {
    title: "La curiosa respuesta de Pep Guardiola cuando lo mencionaron como el mejor DT de la historia",
    content: "Pep Guardiola respondió con humor y humildad a la pregunta sobre ser el mejor entrenador de la historia, destacando la importancia del trabajo en equipo y la dedicación constante.",
    media: [
      {
        type: "image",
        url: "https://media.tycsports.com/files/2025/11/08/900194/pep-guardiola_862x485.webp",
        description: "Pep Guardiola durante un partido reciente"
      }
    ]
  },
  {
    title: "Julián Álvarez opinó sobre su chance en Barcelona y reveló que estuvo cerca del PSG",
    content: "El delantero argentino Julián Álvarez habló sobre su posible fichaje por Barcelona y confirmó conversaciones con el PSG, destacando que siempre analiza las mejores oportunidades para su carrera.",
    media: [
      {
        type: "image",
        url: "https://media.tycsports.com/files/2025/11/08/900100/julian-alvarez_862x485.webp",
        description: "Julián Álvarez en acción durante un partido"
      }
    ]
  },
  {
    title: "Diego Simeone opinó sobre la exclusión de Julián Álvarez en los premios The Best",
    content: "El entrenador del Atlético de Madrid, Diego Simeone, manifestó su opinión sobre la ausencia de Álvarez en la lista de nominados a los premios The Best, destacando su gran desempeño durante la temporada.",
    media: [
      {
        type: "image",
        url: "https://media.tycsports.com/files/2025/11/08/900101/diego-simeone_862x485.webp",
        description: "Diego Simeone en conferencia de prensa"
      }
    ]
  },
  {
    title: "Reflexivo mensaje de Alexis Mac Allister tras la victoria del Liverpool sobre Real Madrid",
    content: "El mediocampista argentino Alexis Mac Allister compartió un mensaje reflexivo luego de la victoria de Liverpool sobre Real Madrid en la UEFA Champions League, destacando el esfuerzo colectivo del equipo.",
    media: [
      {
        type: "image",
        url: "https://media.tycsports.com/files/2025/11/08/900102/mac-allister-liverpool_862x485.webp",
        description: "Alexis Mac Allister durante el partido de Champions"
      }
    ]
  },
  {
    title: "Paulo Dybala se realiza estudios médicos tras lesión en la Roma",
    content: "El delantero argentino Paulo Dybala se sometió a estudios médicos tras una lesión sufrida en la Roma, mientras el club evalúa el tiempo estimado de recuperación.",
    media: [
      {
        type: "image",
        url: "https://media.tycsports.com/files/2025/11/04/899012/paulo-dybala-roma_862x485.webp",
        description: "Paulo Dybala durante un entrenamiento con la Roma"
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

      for (const m of n.media) {
        await MediaGallery.create({
          article_id: article.id,
          type: m.type,
          url: m.url,
          description: m.description
        });
      }
      console.log(`📰 Artículo creado: "${n.title}"`);
    }

    console.log('\n✅ Seed de noticias reales completada!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error importando noticias:', err);
    process.exit(1);
  }
}

seedRealNews();
