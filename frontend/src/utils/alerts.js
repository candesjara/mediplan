import Swal from "sweetalert2";

export const alertSuccess = (msg) =>
  Swal.fire({ icon: "success", title: "Éxito", text: msg, timer: 1500, showConfirmButton: false });

export const alertError = (msg) =>
  Swal.fire({ icon: "error", title: "Error", text: msg });

export const alertConfirm = async (msg) => {
  const res = await Swal.fire({
    icon: "warning",
    title: "Confirmar acción",
    text: msg,
    showCancelButton: true,
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
  });
  return res.isConfirmed;
};
