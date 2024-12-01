// Récupérer tous les liens du menu de navigation
const navLinks = document.querySelectorAll("nav a, div.colonne a");

// Fonction pour changer de section
function afficherSection(e) {
    e.preventDefault(); // Empêche le comportement par défaut du lien

    // Obtenir l'ID de la section ciblée
    const targetId = this.getAttribute("href").substring(1);

    // Masquer toutes les sections
    const sections = document.querySelectorAll("header, section");
    sections.forEach(section => {
        section.classList.remove("active");
    });

    // Afficher la section correspondante
    const targetSection = document.getElementById(targetId);
    if (targetSection) targetSection.classList.add("active");
}

// Ajouter un événement de clic à chaque lien
navLinks.forEach(link => {
    link.addEventListener("click", afficherSection);
});

document.querySelectorAll('.filtre').forEach(button => {
  button.addEventListener('click', () => {
      const role = button.dataset.role;

      // Activer le filtre cliqué
      document.querySelectorAll('.filtre').forEach(btn => btn.classList.remove('actif'));
      button.classList.add('actif');

      // Filtrer les membres
      document.querySelectorAll('.carte-membre').forEach(carte => {
          carte.style.display = (role === 'all' || carte.dataset.role === role) ? 'block' : 'none';
      });
  });
});
const voitureImg = document.querySelector('.voiture-img');
const buttons = document.querySelectorAll('.btn-option');

buttons.forEach((button) => {
    button.addEventListener('click', () => {
        // Changer l'angle
        const angle = button.getAttribute('data-angle');
        if (angle) {
            voitureImg.style.transform = `rotateY(${angle === 'avant' ? 0 : 180}deg)`;
        }

        // Changer la couleur
        const color = button.getAttribute('data-color');
        if (color) {
            voitureImg.src = `../images/work_in_progresss.png-${color}.png`;
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal-article");
    const ouvrirModalBtn = document.getElementById("ouvrir-modal");
    const fermerModalBtn = document.getElementById("fermer-modal");
    const publierBtn = document.getElementById("publier-article");

    const titreInput = document.getElementById("titre-article");
    const descriptionInput = document.getElementById("description-article");
    const imageInput = document.getElementById("image-article");
    const descriptionImageInput = document.getElementById("description-image-article"); // Nouveau champ

    const aperçuArticle = document.getElementById("aperçu-article");
    const actualitesSection = document.getElementById("actualites");

    // Ouvrir le modal
    ouvrirModalBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    // Fermer le modal
    fermerModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Mise à jour de l'aperçu en temps réel
    [titreInput, descriptionInput, imageInput, descriptionImageInput].forEach((input) => {
        input.addEventListener("input", () => {
            const titre = titreInput.value || "Titre d'aperçu";
            const description = descriptionInput.value || "Description d'aperçu";
            const image = imageInput.value || "../images/work_in_progresss.png";
            const descriptionImage = descriptionImageInput.value || "Description de l'image";

            aperçuArticle.querySelector(".titre_article").textContent = titre;
            aperçuArticle.querySelector(".description_article").textContent = description;
            aperçuArticle.querySelector(".image_article").src = image;
            aperçuArticle.querySelector(".description_article_image").textContent = descriptionImage;
        });
    });

    publierBtn.addEventListener("click", () => {
        const titre = titreInput.value;
        const description = descriptionInput.value;
        const image = imageInput.value;
        const descriptionImage = descriptionImageInput.value
    
        if (!titre || !description || !descriptionImage) {
            alert("Veuillez remplir tous les champs avant de publier !");
            return;
        }

        const fileName = `articles/article_${Date.now()}.json`;
    
        // Appel de la fonction pour sauvegarder dans S3
        sauvegarderArticle(titre, description, image, fileName);
    
        // Ajouter l'article à la page localement
        const nouvelArticle = document.createElement("article");
        nouvelArticle.classList.add("article");
        nouvelArticle.innerHTML = `
            <div class="div_article_description">
                <h2 class="titre_article">${titre}</h2>
                <p class="description_article">${description}</p>
            </div>
            <div class="div_article">
                <img src="${image}" alt="${titre}" class="image_article">
                <p class="description_article_image">${description}</p>
            </div>
            <button class="supprimer-article" data-filename="${fileName}">Supprimer</button>
        `;

        // Ajout du bouton de suppression
        nouvelArticle.querySelector(".supprimer-article").addEventListener("click", function () {
            supprimerArticle(fileName, nouvelArticle);
        });

        actualitesSection.appendChild(nouvelArticle);
    
        // Réinitialiser les champs et fermer le modal
        titreInput.value = "";
        descriptionInput.value = "";
        imageInput.value = "";
        modal.style.display = "none";
    });
});

// Configuration AWS SDK
AWS.config.update({
    accessKeyId: 'AKIAQMEY5Y7LX4RE76QZ', // Remplacez par votre Access Key
    secretAccessKey: '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', // Remplacez par votre Secret Key
    region: 'eu-north-1' // Remplacez par votre région
});

const s3 = new AWS.S3();
const bucketName = 'sitecec';

function sauvegarderArticle(titre, description, imageURL, fileName) {
    const article = {
        titre: titre,
        description: description,
        imageURL: imageURL,
        date: new Date().toISOString()
    };

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: JSON.stringify(article),
        ContentType: 'application/json'
    };

    s3.upload(params, function (err, data) {
        if (err) {
            console.error('Erreur lors de l’upload:', err.message);
            alert(`Erreur: ${err.message}`);
        } else {
            console.log('Succès ! Fichier sauvegardé à:', data.Location);
            alert('Article sauvegardé avec succès !');
        }
    });
}

function supprimerArticle(fileName, articleElement) {
    const params = {
        Bucket: bucketName,
        Key: fileName
    };

    s3.deleteObject(params, function (err, data) {
        if (err) {
            console.error("Erreur lors de la suppression:", err.message);
            alert(`Erreur: ${err.message}`);
        } else {
            console.log("Article supprimé avec succès :", fileName);
            alert("Article supprimé !");
            // Retirer l'article de l'interface
            articleElement.remove();
        }
    });
}