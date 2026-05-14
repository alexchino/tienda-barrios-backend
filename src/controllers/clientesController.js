import  Cliente from "../models/clienteModel.js"; // Asegúrate de crear este modelo

/* =========================
    👤 OBTENER CLIENTES
========================= */
export const obtenerClientes = async (req, res) => {
  try {
    // Reemplaza el SELECT * FROM clientes ORDER BY clienteid ASC
    const clientes = await Cliente.find().sort({ createdAt: 1 });
    
    // Mapeamos para mantener los nombres que tu Frontend ya conoce
    const respuesta = clientes.map(c => ({
      clienteid: c._id,
      Nombre: c.nombre,
      Apellido: c.apellido,
      Telefono: c.telefono,
      Correo: c.correo
    }));

    res.json(respuesta);
  } catch (error) {
    console.error("❌ Error al obtener clientes:", error.message);
    res.status(500).json({ message: "Error al obtener clientes", error: error.message });
  }
};

/* =========================
    ➕ CREAR CLIENTE
========================= */
export const crearCliente = async (req, res) => {
  try {
    const { Nombre, Apellido, Telefono, Correo } = req.body;

    if (!Nombre || !Apellido) {
      return res.status(400).json({ message: "Los campos Nombre y Apellido son obligatorios" });
    }

    const nuevoCliente = new Cliente({
      nombre: Nombre,
      apellido: Apellido,
      telefono: Telefono || null,
      correo: Correo || null
    });

    await nuevoCliente.save();

    res.status(201).json({ message: "✅ Cliente creado correctamente en Atlas" });
  } catch (error) {
    console.error("❌ Error al crear cliente:", error.message);
    res.status(500).json({ message: "Error al crear cliente", error: error.message });
  }
};

/* =========================
    ✏️ ACTUALIZAR CLIENTE
========================= */
export const actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { Nombre, Apellido, Telefono, Correo } = req.body;

    const clienteActualizado = await Cliente.findByIdAndUpdate(
      id,
      { 
        nombre: Nombre, 
        apellido: Apellido, 
        telefono: Telefono || null, 
        correo: Correo || null 
      },
      { new: true }
    );

    if (!clienteActualizado) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.json({ message: "✅ Cliente actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar cliente:", error.message);
    res.status(500).json({ message: "Error al actualizar cliente", error: error.message });
  }
};

/* =========================
    🗑️ ELIMINAR CLIENTE
========================= */
export const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    // En MongoDB simplemente usamos findByIdAndDelete
    const eliminado = await Cliente.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.json({ message: "🗑️ Cliente eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar cliente:", error.message);
    // Nota: MongoDB no bloquea el borrado por "FK" automáticamente a menos que lo programes,
    // pero es buena práctica avisar si algo falla.
    res.status(500).json({ message: "No se pudo eliminar el cliente" });
  }
};