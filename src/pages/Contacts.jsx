import { useState, useEffect } from "react";

export const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agendaExists, setAgendaExists] = useState(true);
  const [editingId, setEditingId] = useState(null); // id del contacto que estamos editando

  const AGENDA_SLUG = "andrea";

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
  });

  // 🔹 GET contactos
  const getContacts = async () => {
    try {
      setLoading(true);
      setAgendaExists(true);

      const res = await fetch(
        `https://playground.4geeks.com/contact/agendas/${AGENDA_SLUG}/contacts`
      );

      if (res.status === 404) {
        setAgendaExists(false);
        setContacts([]);
        return;
      }

      const data = await res.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error("Error al cargar contactos:", error);
      setAgendaExists(false);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Crear contacto (POST)
  const createContact = async () => {
    try {
      setSaving(true);
      setSuccess(false);

      const res = await fetch(
        `https://playground.4geeks.com/contact/agendas/${AGENDA_SLUG}/contacts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Error al guardar contacto");

      resetForm();
      setSuccess(true);
      setTimeout(() => {
        getContacts();
        setSuccess(false);
      }, 1000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Actualizar contacto (PUT)
  const updateContact = async (id) => {
    try {
      setSaving(true);
      setSuccess(false);

      const res = await fetch(
        `https://playground.4geeks.com/contact/agendas/${AGENDA_SLUG}/contacts/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar contacto");

      resetForm();
      setSuccess(true);
      setTimeout(() => {
        getContacts();
        setSuccess(false);
      }, 1000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
      setEditingId(null);
    }
  };

  // 🔹 Eliminar contacto (DELETE)
  const deleteContact = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este contacto?")) return;

    try {
      setSaving(true);
      const res = await fetch(
        `https://playground.4geeks.com/contact/agendas/${AGENDA_SLUG}/contacts/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Error al eliminar contacto");

      getContacts();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Manejar submit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateContact(editingId);
    } else {
      createContact();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (contact) => {
    setFormData({
      name: contact.name,
      lastname: contact.lastname,
      email: contact.email,
      phone: contact.phone,
      address: contact.address,
    });
    setEditingId(contact.id);
  };

  const resetForm = () => {
    setFormData({ name: "", lastname: "", email: "", phone: "", address: "" });
    setEditingId(null);
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Contactos</h2>

      {!agendaExists ? (
        <div className="alert alert-warning text-center">
          ⚠️ La agenda "{AGENDA_SLUG}" no está creada.
        </div>
      ) : (
        <>
          {success && (
            <div className="alert alert-success text-center">
              {editingId ? "Contacto actualizado ✅" : "Contacto guardado ✅"}
            </div>
          )}

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="mb-5">
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  className="form-control"
                  name="name"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  name="lastname"
                  placeholder="Apellido"
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control"
                  name="phone"
                  placeholder="Teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12">
                <input
                  className="form-control"
                  name="address"
                  placeholder="Dirección"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12">
                <button
                  className="btn btn-primary w-100"
                  type="submit"
                  disabled={saving}
                >
                  {saving
                    ? editingId
                      ? "Actualizando..."
                      : "Guardando..."
                    : editingId
                    ? "Actualizar contacto"
                    : "Guardar contacto"}
                </button>
              </div>
            </div>
          </form>

          {/* LISTA DE CONTACTOS */}
          <h3 className="mb-3">Lista de contactos</h3>

          {loading ? (
            <p className="text-center">Cargando contactos...</p>
          ) : contacts.length === 0 ? (
            <p className="text-center">No hay contactos en esta agenda</p>
          ) : (
            <ul className="list-group">
              {contacts.map((contact) => (
                <li key={contact.id} className="list-group-item d-flex justify-content-between align-items-start">
                  <div>
                    <strong>{contact.name} {contact.lastname}</strong>
                    <br />📧 {contact.email}
                    <br />📞 {contact.phone}
                    <br />📍 {contact.address}
                  </div>
                  <div>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEditClick(contact)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteContact(contact.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};
