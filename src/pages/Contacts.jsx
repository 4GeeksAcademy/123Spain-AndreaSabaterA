import { useState, useEffect } from "react";

export const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agendaExists, setAgendaExists] = useState(true); //  controlar si la agenda existe

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
        // Agenda no existe
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

  // 🔹 POST contacto
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

      if (!res.ok) {
        throw new Error("Error al guardar contacto");
      }

      setFormData({ name: "", lastname: "", email: "", phone: "", address: "" });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    createContact();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Contactos</h2>

      {!agendaExists ? (
        <div className="alert alert-warning text-center">
          La agenda "{AGENDA_SLUG}" no está creada.
        </div>
      ) : (
        <>
          {success && (
            <div className="alert alert-success text-center">
              Contacto guardado correctamente 
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
                  {saving ? "Guardando..." : "Guardar contacto"}
                </button>
              </div>
            </div>
          </form>

          {/* LISTA CONTACTOS */}
          <h3 className="mb-3">Lista de contactos</h3>

          {loading ? (
            <p className="text-center">Cargando contactos...</p>
          ) : contacts.length === 0 ? (
            <p className="text-center">No hay contactos en esta agenda</p>
          ) : (
            <ul className="list-group">
              {contacts.map((contact) => (
                <li key={contact.id} className="list-group-item">
                  <strong>{contact.name} {contact.lastname}</strong>
                  <br /> {contact.email}
                  <br /> {contact.phone}
                  <br /> {contact.address}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

