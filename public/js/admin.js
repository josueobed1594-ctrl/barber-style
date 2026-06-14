document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // CONFIRMAR CITA
    // =========================
    document.querySelectorAll('.confirmar-btn').forEach(btn => {

        btn.addEventListener('click', () => {

            const id = btn.dataset.id;

            console.log("CLICK confirmar:", id);

            fetch(`/admin/citas/confirmar/${id}`, {
                method: 'POST'
            })
            .then(res => res.json())
            .then(data => {

                console.log("RESPUESTA:", data);

                if (data.ok) {

                    const fila = document.getElementById(`cita-${id}`);

                    fila.querySelector('.estado').innerHTML =
                        '<span class="badge bg-success">confirmada</span>';

                    // opcional: quitar botones
                    fila.querySelectorAll('button').forEach(btn => btn.remove());

                }

            })
            .catch(err => console.error("ERROR:", err));

        });

    });

    // =========================
    // CANCELAR CITA
    // =========================
    document.querySelectorAll('.cancelar-btn').forEach(btn => {

        btn.addEventListener('click', () => {

            const id = btn.dataset.id;

            console.log("CLICK cancelar:", id);

            fetch(`/admin/citas/cancelar/${id}`, {
                method: 'POST'
            })
            .then(res => res.json())
            .then(data => {

                console.log("RESPUESTA:", data);

                if (data.ok) {

                    const fila = document.getElementById(`cita-${id}`);

                    fila.querySelector('.estado').innerHTML =
                        '<span class="badge bg-danger">cancelada</span>';

                    // opcional: quitar botones
                    fila.querySelectorAll('button').forEach(btn => btn.remove());

                }

            })
            .catch(err => console.error("ERROR:", err));

        });

    });

    // BOTONES FINALIZAR
document.querySelectorAll('.finalizar-btn').forEach(btn => {

    btn.addEventListener('click', () => {

        const id = btn.dataset.id;

        fetch(`/admin/citas/finalizar/${id}`, {
            method: 'POST'
        })
        .then(res => res.json())
        .then(data => {

            if (data.ok) {

                const fila =
                    document.getElementById(`cita-${id}`);

                fila.querySelector('.estado').innerHTML =
                    '<span class="badge bg-primary">finalizada</span>';

            }

        })
        .catch(err => console.error(err));

    });

});



// =========================
// ELIMINAR CITA
// =========================
document.querySelectorAll('.eliminar-btn').forEach(btn => {

    btn.addEventListener('click', () => {

        const id = btn.dataset.id;

        const confirmar = confirm(
            '¿Seguro que deseas eliminar esta cita?'
        );

        if (!confirmar) return;

        fetch(`/admin/citas/eliminar/${id}`, {
            method: 'POST'
        })
        .then(res => res.json())
        .then(data => {

            if (data.ok) {

                const fila =
                    document.getElementById(`cita-${id}`);

                fila.remove();

            }

        })
        .catch(err => console.error(err));

    });

});



});