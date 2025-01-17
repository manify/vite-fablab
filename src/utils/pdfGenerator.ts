import { jsPDF } from 'jspdf';

export const generateLabCesiChartePDF = async () => {
  const doc = new jsPDF();
  let y = 20;
  const lineHeight = 7;
  const pageWidth = 210;
  const margin = 20;
  const textWidth = pageWidth - (margin * 2);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text("CHARTE D'UTILISATION DES LAB'CESI", margin, y);
  y += lineHeight * 2;

  // Subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const subtitle = "IMAGINER, COLLABORER ET EXPÉRIMENTER LES CONCEPTS DU FUTUR";
  doc.text(subtitle, margin, y);
  y += lineHeight * 2;

  // Introduction
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const intro = "CESI dispose dans tous ses campus de lieux de prototypage, d'expérimentation et de création désignés « Lab'CESI ». Les Lab CESI sont basés sur des principes d'ouverture, d'accessibilité et d'apprentissage par les pairs. La présente charte vise à exprimer les conditions d'usage des équipements et d'accès relatives à ces espaces.";
  const splitIntro = doc.splitTextToSize(intro, textWidth);
  doc.text(splitIntro, margin, y);
  y += (splitIntro.length * lineHeight) + lineHeight;

  // Sections
  const addSection = (title: string, content: string) => {
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, y);
    y += lineHeight;
    doc.setFont('helvetica', 'normal');
    const splitContent = doc.splitTextToSize(content, textWidth);
    doc.text(splitContent, margin, y);
    y += (splitContent.length * lineHeight) + lineHeight;

    // Add new page if needed
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  };

  // Add all sections
  addSection("1. Accès libre aux espaces", 
    "Les Lab'CESI sont en accès libre. Ainsi, les stagiaires de CESI peuvent accéder aux espaces et les utiliser, de manière autonome ou dans le cadre de leur formation. Sur les plages d'ouverture des Lab CESI, toute personne désireuse de découvrir la fabrication numérique et/ou participer à des projets peut y entrer. Chaque utilisateur doit signaler sa présence au FabManager et tenir compte des consignes apportées.");

  addSection("2. Usage des équipements",
    "L'usage des équipements n'est possible que sur les créneaux horaires définis par chaque Lab CESI. Pour les stagiaires inscrits à une formation CESI, l'entrée est libre et gratuite. Pour les autres utilisateurs, un contrat particulier peut être demandé, notamment dans le cadre d'une prestation de service. Chaque Lab'CESI met à disposition des équipements qui lui sont propres. Certains équipements peuvent nécessiter des formations spécifiques et présenter des restrictions d'accès.");

  addSection("3. Engagement des Lab'CESI",
    "Les Lab'CESI accueillent tous les stagiaires inscrits aux formations CESI, ses salariés, ainsi que le grand public en fonction de la disponibilité du lieu. Les campus sont engagés pour la découverte, la vulgarisation et la facilitation de l'usage des outils numériques.");

  addSection("4. Engagement de l'utilisateur",
    "Est appelé utilisateur du LabCESI, toute personne utilisant les ressources matérielles et techniques mises à disposition, afin de réaliser un prototype ou un objet en respectant les conditions définies dans la charte.");

  // Add remaining sections...
  addSection("5. Propriété Intellectuelle",
    "Les productions du Lab'CESI favorisent l'utilisation de licences libres telles que les Creative Commons. Le principe des Lab'CESI est celui de la co-construction, du partage de l'invention. Les créations peuvent être protégées par leur auteur au sens du code de la propriété intellectuelle.");

  addSection("6. Les conditions à respecter",
    "Le respect des conditions de sécurité est primordial. L'utilisation de tout équipement doit préalablement être validée par le responsable. Les utilisateurs doivent participer au rangement et à l'entretien des équipements. Les consommables restent à la charge des utilisateurs.");

  addSection("7. La contrefaçon",
    "Aucune contrefaçon n'est autorisée. CESI se désengage de toute responsabilité en cas de poursuite d'utilisateurs.");

  addSection("8. L'éthique",
    "Tout projet est conduit avec la connaissance et le respect des cadres légaux en vigueur. Les utilisateurs sont incités à associer un raisonnement éthique au projet qu'ils réalisent dans les Lab'CESI.");

  // Footer
  doc.setFontSize(8);
  doc.text("Fait à Paris, le 08 juillet 2019", margin, 280);

  return doc;
};