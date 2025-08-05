import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import config from './config.json';
import { useAuth } from './AuthContext';

export default function AdminPage() {
  const { user } = useAuth();

  const [name, setName] = useState('');

  const [price, setPrice] = useState('');

  const [stock, setStock] = useState('');

  const [specifications, setSpecifications] = useState('');

  const [description, setDescription] = useState('');

  const [newImages, setNewImages] = useState([]);

  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  const location = useLocation();

  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);

  const [editModal, setEditModal] = useState({ type: null, data: null });

  const [mImages, setImages] = useState([]);

  const [api, setApi] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    track("Accessed admin platform", user.id);
    fetch('/api/v1/admin/products.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
    .then(res => {
      if (!res.ok) throw new Error('Internal Server Error');
      return res.json();
    })
    .then(data => {
    const parsedProducts = data.map(product => ({
        ...product,
        image_location: typeof product.image_location === 'string'
            ? JSON.parse(product.image_location)
            : product.image_location
        }));
      setProducts(parsedProducts);
    })
    .catch(err => {
      setError(err.message);
    });
  };

  const track = async (action, uid) => {
    fetch('/api/v1/admin/track.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        track_api: config.apiUrl,
        action: action,
        user: uid,
        time: new Date().toLocaleString()
      })
    }).then( dt => {
      console.log("Success!");
    }).catch( err => {
      setError(err.message);
    });
  }

  const fetchUsers = async () => {
    fetch('/api/v1/admin/users.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
    .then(res => {
      if (!res.ok) throw new Error('Internal Server Error');
      return res.json();
    })
    .then(data => {
      setUsers(data);
    })
    .catch(err => {
      setError(err.message);
    });
  };

  const handleDeleteProduct = (id) => {
    fetch("/api/v1/admin/delete_products.php?id="+String(id), {
      method: 'DELETE',
      credentials: 'include'
    })
    .then(res => {
      if (!res.ok) throw new Error('Internal Server Error');
      track("Product "+id+" deleted", user.id);
      window.location.reload();
      return res.json();
    })
    .catch(err => {
      setError(err.message);
    });
  };

  const handleDeleteUser = (id) => {
    fetch("/api/v1/admin/delete_users.php?id="+String(id), {
      method: 'DELETE',
      credentials: 'include'
    })
    .then(res => {
      if (!res.ok) throw new Error('Internal Server Error');
      track("User "+id+" deleted", user.id);
      window.location.reload();
      return res.json();
    })
    .catch(err => {
      setError(err.message);
    });
  };
  
  const handleFileChange = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('specifications', specifications);
    formData.append('description', description);
  
    for (let i = 0; i < newImages.length; i++) {
      formData.append('newImages[]', newImages[i]);
    }
  
    try {
      const res = await fetch('/api/v1/admin/add_product.php', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
  
      if (!res.ok) throw new Error('Error creating the product');
      track("Product "+name+" added", user.id);
      window.location.reload();
      const data = await res.json();

    } catch (err) {
      console.error(err.message);
    }
  };  

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      navigate('/login');
    } else if (user.role === 'administrator') {
      fetchProducts();
      fetchUsers();
    }
  }, [user, navigate]);

  useEffect(() => {
    if (editModal.data?.image_location) {
      setImages([...editModal.data.image_location]);
    }
    }, [editModal.data]);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Admin Control Panel</h1>

      <section style={styles.section}>
        <h2 style={styles.subHeader}>Add New Product</h2>
          <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            style={styles.input}
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Price"
            style={styles.input}
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Stock"
            style={styles.input}
            value={stock}
            onChange={e => setStock(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Specifications"
            style={styles.input}
            value={specifications}
            onChange={e => setSpecifications(e.target.value)}
          />
          <textarea
            placeholder="Description"
            style={styles.textarea}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            multiple
            style={styles.inputFile}
            onChange={handleFileChange}
          />
          <button type="submit" style={styles.button}>Add Product</button>
        </form>
      </section>

      <section style={styles.section}>
        <h2 style={styles.subHeader}>Manage Products</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Specifications</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={styles.td}>{p.id}</td>
                <td style={styles.td}>
                  <img src={p.image_location[0]} alt={p.name} style={styles.image} />
                </td>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>${Number(p.price).toFixed(2)}</td>
                <td style={styles.td}>{p.stock}</td>
                <td style={styles.td}>{p.description}</td>
                <td style={styles.td}>{p.specifications}</td>
                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    <button onClick={() => setEditModal({ type: 'product', data: p })} style={styles.editButton}>Edit</button>
                    <button onClick={() => handleDeleteProduct(p.id)} style={styles.deleteButton}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={styles.section}>
      <h2 style={styles.subHeader}>Manage Users</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Bio</th>
            <th style={styles.th}>Verified</th>
            <th style={styles.th}>Address</th>
            <th style={styles.th}>Phone</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td style={styles.td}>{u.id}</td>
              <td style={styles.td}>{u.username}</td>
              <td style={styles.td}>{u.role}</td>
              <td style={styles.td}>{u.bio}</td>
              <td style={styles.td}>{u.verified ? 'Yes' : 'No'}</td>
              <td style={styles.td}>{u.address || '-'}</td>
              <td style={styles.td}>{u.phone || '-'}</td>
              <td style={styles.td}>{u.email || '-'}</td>
              <td style={styles.td}>
                <div style={styles.actionButtons}>
                  <button onClick={() => setEditModal({ type: 'user', data: u })} style={styles.editButton}>Edit</button>
                  <button onClick={() => handleDeleteUser(u.id)} style={styles.deleteButton}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>


      {editModal.type && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Edit {editModal.type === 'product' ? 'Product' : 'User'}</h3>
            {editModal.type === 'product' ? (
               <form
               onSubmit={(e) => {
                e.preventDefault();
                
                const form = e.target;
                const original_imgs = products.find(p => p.id === editModal.data.id)?.image_location || [];
                const formData = new FormData();
                formData.append('id', editModal.data.id);
                formData.append('name', form.name.value);
                formData.append('price', form.price.value);
                formData.append('stock', form.stock.value);
                formData.append('specifications', form.specifications.value);
                formData.append('description', form.description.value);
           
                const newFiles = form.newImages.files;
                for (let i = 0; i < newFiles.length; i++) {
                  formData.append('newImages[]', newFiles[i]);
                }

                const deletedImages = original_imgs.filter(img => !mImages.includes(img));

                if (deletedImages.length > 0) {
                  deletedImages.forEach((img) => {
                    formData.append('deletedImages[]', img);
                  });
                } else {
                  formData.append('deletedImages[]', '');
                }
                           
                fetch('/api/v1/admin/edit_product.php', {
                   method: 'POST',
                   credentials: 'include',
                   body: formData,
                 })
                   .then((res) => res.json())
                   .then((data) => {
                      track("Product "+editModal.data.id+" edited", user.id);
                      setEditModal({ type: null, data: null });
                      window.location.reload();
                   });
               }}
             >
               <input name="name" defaultValue={editModal.data.name} style={styles.input} />
               <input name="price" type="number" defaultValue={editModal.data.price} style={styles.input} />
               <input name="stock" type="number" defaultValue={editModal.data.stock} style={styles.input} />
               <input name="specifications" defaultValue={editModal.data.specifications} style={styles.input} />
               <textarea name="description" defaultValue={editModal.data.description} style={styles.textarea} />
               <div>
                 <strong>Current Images:</strong>
                 <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.5rem 0' }}>
                   {editModal.data.image_location.map((img, idx) => (
                     <div key={idx} style={{ position: 'relative' }}>
                       <img
                         src={img}
                         alt={`img-${idx}`}
                         style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                       />
                       <button
                         type="button"
                         onClick={() => {
                           const updated = [...editModal.data.image_location];
                           updated.splice(idx, 1);
                           setEditModal((prev) => ({
                             ...prev,
                             data: { ...prev.data, image_location: updated },
                           }));
                         }}
                         style={{
                           position: 'absolute',
                           top: '-6px',
                           right: '-6px',
                           background: '#f00',
                           color: '#fff',
                           border: 'none',
                           borderRadius: '50%',
                           width: '18px',
                           height: '18px',
                           fontSize: '12px',
                           cursor: 'pointer',
                           padding: 0,
                         }}
                       >
                         ×
                       </button>
                     </div>
                   ))}
                 </div>
               </div>
           
               <input
                 type="file"
                 name="newImages"
                 accept="image/*"
                 multiple
                 style={styles.inputFile}
               />
           
               <button type="submit" style={styles.button}>Save</button>
               <button
                 type="button"
                 onClick={() => setEditModal({ type: null, data: null })}
                 style={styles.deleteButton}
               >
                 Cancel
               </button>
             </form>          
            ) : (
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const formData = new FormData();
                formData.append('id', editModal.data.id);
                formData.append('username', form.username.value);
                formData.append('role', form.role.value);
                formData.append('bio', form.bio.value);
                formData.append('verified', form.verified.value);
                formData.append('address', form.address.value);
                formData.append('phone', form.phone.value);
                formData.append('email', form.email.value);
              
                fetch('/api/v1/admin/edit_users.php', {
                  method: 'POST',
                  credentials: 'include',
                  body: formData,
                })
                .then((res) => res.json())
                .then((data) => {
                  track("User "+editModal.data.id+" edited", user.id);
                  setEditModal({ type: null, data: null });
                  window.location.reload();
                });
              }}>
                <input name="username" defaultValue={editModal.data.username} style={styles.input} />
                <input name="role" defaultValue={editModal.data.role} style={styles.input} />
                <input name="bio" defaultValue={editModal.data.bio} style={styles.input} />
                <input name="verified" defaultValue={editModal.data.verified} style={styles.input} />
              
                {/* Nuevos campos añadidos */}
                <input name="address" defaultValue={editModal.data.address || ''} placeholder="Address" style={styles.input} />
                <input name="phone" defaultValue={editModal.data.phone || ''} placeholder="Phone" style={styles.input} />
                <input name="email" defaultValue={editModal.data.email || ''} placeholder="Email" type="email" style={styles.input} />
              
                <button type="submit" style={styles.button}>Save</button>
                <button onClick={() => setEditModal({ type: null, data: null })} style={styles.deleteButton}>Cancel</button>
              </form>              
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '2rem auto',
    padding: '2rem',
    background: '#000',
    color: '#0f0',
    fontFamily: 'monospace',
    borderRadius: '12px',
    boxShadow: '0 0 20px #0f0a',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '2rem',
    borderBottom: '1px solid #0f0',
    paddingBottom: '0.5rem',
  },
  subHeader: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
  },
  section: {
    marginBottom: '3rem',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  input: {
    padding: '0.5rem',
    border: '1px solid #0f0',
    background: '#111',
    color: '#0f0',
    borderRadius: '6px',
  },
  textarea: {
    gridColumn: 'span 2',
    padding: '0.5rem',
    border: '1px solid #0f0',
    background: '#111',
    color: '#0f0',
    borderRadius: '6px',
    resize: 'vertical',
    minHeight: '80px',
  },
  inputFile: {
    color: '#0f0',
    background: '#111',
    border: '1px solid #0f0',
    padding: '0.4rem',
    borderRadius: '6px',
  },
  button: {
    padding: '0.5rem 1rem',
    background: '#0f0',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 0 10px #0f0a',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#111',
    border: '1px solid #0f0',
  },
  th: {
    border: '1px solid #0f0',
    padding: '0.75rem',
    textAlign: 'center',
    verticalAlign: 'middle',
    backgroundColor: '#000',
    color: '#0f0',
  },
  td: {
    border: '1px solid #0f0',
    padding: '0.75rem',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  image: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '6px',
  },
  deleteButton: {
    padding: '0.4rem 0.8rem',
    background: '#f00',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    margin: '0.2rem',
  },
  editButton: {
    padding: '0.4rem 0.8rem',
    background: '#ff0',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    margin: '0.2rem',
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'center',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modal: {
    background: '#111',
    padding: '2rem',
    border: '1px solid #0f0',
    borderRadius: '10px',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
};
