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
    const descriptionImageInput = document.getElementById("description-image-article");

    const aperçuArticle = document.getElementById("aperçu-article");
    const actualitesSection = document.getElementById("actualites");

    const githubToken = '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'; // Remplacez par votre token GitHub
    const githubOwner = 'Cam68026'; // Remplacez par votre nom d'utilisateur GitHub
    const githubRepo = 'sitecec'; // Remplacez par le nom du dépôt
    const githubBranch = 'main'; // Branche où vous souhaitez travailler
    afficherArticles();

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
            const image = imageInput.value || "images/work_in_progresss.png";
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
        const descriptionImage = descriptionImageInput.value;

        if (!titre || !description || !descriptionImage) {
            alert("Veuillez remplir tous les champs avant de publier !");
            return;
        }

        const fileName = `article_${Date.now()}.json`;

        // Appel de la fonction pour sauvegarder dans GitHub
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
                <p class="description_article_image">${descriptionImage}</p>
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
        descriptionImageInput.value = "";
        modal.style.display = "none";
    });

    function sauvegarderArticle(titre, description, imageURL, fileName) {
        const article = {
            titre: titre,
            description: description,
            imageURL: imageURL,
            date: new Date().toISOString()
        };

        const filePath = `articles/${fileName}`;

        // Appel à l'API GitHub pour créer/mettre à jour un fichier
        fetch(`https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${githubToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Ajout de l'article ${fileName}`,
                content: btoa(JSON.stringify(article)), // Encodage en base64
                branch: githubBranch
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.content) {
                    console.log('Succès ! Article sauvegardé à :', data.content.html_url);
                    alert('Article sauvegardé avec succès sur GitHub !');
                } else {
                    console.error('Erreur lors de la sauvegarde :', data);
                    alert('Erreur lors de la sauvegarde. Consultez la console.');
                }
            })
            .catch(err => {
                console.error('Erreur réseau ou API :', err.message);
                alert('Erreur réseau ou API.');
            });
    }

    function supprimerArticle(fileName, articleElement) {
        const filePath = `articles/${fileName}`;

        // Récupérer le SHA du fichier avant suppression
        fetch(`https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filePath}`, {
            headers: {
                'Authorization': `token ${githubToken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.sha) {
                    // Appel à l'API GitHub pour supprimer un fichier
                    return fetch(`https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filePath}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `token ${githubToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            message: `Suppression de l'article ${fileName}`,
                            sha: data.sha,
                            branch: githubBranch
                        })
                    });
                } else {
                    throw new Error('Fichier introuvable sur GitHub.');
                }
            })
            .then(response => {
                if (response.ok) {
                    console.log('Article supprimé avec succès :', fileName);
                    alert('Article supprimé sur GitHub !');
                    articleElement.remove();
                } else {
                    console.error('Erreur lors de la suppression :', response);
                    alert('Erreur lors de la suppression. Consultez la console.');
                }
            })
            .catch(err => {
                console.error('Erreur réseau ou API :', err.message);
                alert('Erreur réseau ou API.');
            });
    }
    function afficherArticles() {
        const dossierArticles = 'articles/';
        const actualitesSection = document.getElementById("actualites");
    
        // Récupérer la liste des fichiers dans le dossier "articles/"
        fetch(`https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${dossierArticles}?ref=${githubBranch}`, {
            headers: {
                'Authorization': `token ${githubToken}`
            }
        })
        .then(response => response.json())
        .then(fichiers => {
            if (Array.isArray(fichiers)) {
                fichiers.forEach(fichier => {
                    if (fichier.name.endsWith('.json')) {
                        // Récupérer le contenu de chaque fichier JSON
                        fetch(fichier.download_url)
                            .then(response => response.json())
                            .then(article => {
                                // Créer l'élément HTML pour afficher l'article
                                const nouvelArticle = document.createElement("article");
                                nouvelArticle.classList.add("article");
                                nouvelArticle.innerHTML = `
                                    <div class="div_article_description">
                                        <h2 class="titre_article">${article.titre}</h2>
                                        <p class="description_article">${article.description}</p>
                                    </div>
                                    <div class="div_article">
                                        <img src="${article.imageURL}" alt="${article.titre}" class="image_article">
                                        <p class="description_article_image">${article.description}</p>
                                    </div>
                                    <button class="supprimer-article" data-filename="${fichier.name}">Supprimer</button>
                                `;
    
                                // Ajouter un gestionnaire pour le bouton de suppression
                                nouvelArticle.querySelector(".supprimer-article").addEventListener("click", function () {
                                    supprimerArticle(fichier.name, nouvelArticle);
                                });
    
                                // Ajouter l'article à la section "actualites"
                                actualitesSection.appendChild(nouvelArticle);
                            })
                            .catch(err => console.error("Erreur lors du chargement de l'article :", err.message));
                    }
                });
            } else {
                console.error("Aucun fichier trouvé dans le dossier articles/ :", fichiers);
                alert("Aucun article disponible pour le moment.");
            }
        })
        .catch(err => {
            console.error("Erreur lors de la récupération des fichiers :", err.message);
            alert("Impossible de récupérer les articles.");
        });
    }
    
});


function openLightbox(imageSrc) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  lightboxImg.src = imageSrc;
  lightbox.style.display = 'flex';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.style.display = 'none';
}
