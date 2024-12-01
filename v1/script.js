function openModal(modalId) {
    document.getElementById(`modal-${modalId}`).style.display = "block";
    document.getElementById("modal-overlay").style.display = "block"; // Afficher l'overlay
}

function closeModal(...modalIds) {
    modalIds.forEach(modalId => {
        document.getElementById(`modal-${modalId}`).style.display = "none";
        document.getElementById("modal-overlay").style.display = "none";
    });
}

// Ferme le modal si l'utilisateur clique en dehors du contenu
window.addEventListener('click', (event) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
