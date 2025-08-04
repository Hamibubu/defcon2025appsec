import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductList() {
  // Estados de productos y UI
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para filtros
  const [nameFilter, setNameFilter] = useState('');
  const [specFilter, setSpecFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minStock, setMinStock] = useState('');
  const [maxStock, setMaxStock] = useState('');
  const [sortPriceAsc, setSortPriceAsc] = useState(true);

  // Estado para saber si estamos haciendo búsqueda avanzada
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);

  // Carga inicial de top products
  useEffect(() => {
    setLoading(true);
    fetch('/api/v1/products_top.php')
      .then(res => {
        if (!res.ok) throw new Error('Error fetching top products');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
        setIsAdvancedSearch(false); // Es la carga inicial, no avanzada
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Función para buscar con filtros avanzados
  const handleSearch = () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();

    if (nameFilter) params.append('name', nameFilter);
    if (specFilter) params.append('specifications', specFilter);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (inStockOnly) params.append('inStockOnly', '1');
    if (minStock) params.append('minStock', minStock);
    if (maxStock) params.append('maxStock', maxStock);
    params.append('sortPriceAsc', sortPriceAsc ? '1' : '0');

    fetch(`/api/v1/products_search.php?index=products&${params.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error('Error fetching filtered products');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
        setIsAdvancedSearch(true);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <div style={{ maxWidth: 960, margin: 'auto', padding: '1rem' }}>
      <h2 style={{ color: '#0f0' }}>
        {isAdvancedSearch ? 'Advanced Search Results' : 'Top Products'}
      </h2>

      {/* Formulario filtros */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1rem',
        color: '#0f0',
      }}>
        <input
          type="text"
          placeholder="Product name"
          value={nameFilter}
          onChange={e => setNameFilter(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Specifications"
          value={specFilter}
          onChange={e => setSpecFilter(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          min="0"
          placeholder="Min price"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          min="0"
          placeholder="Max price"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          min="0"
          placeholder="Min stock"
          value={minStock}
          onChange={e => setMinStock(e.target.value)}
          style={inputStyle}
        />
        <input
          type="number"
          min="0"
          placeholder="Max stock"
          value={maxStock}
          onChange={e => setMaxStock(e.target.value)}
          style={inputStyle}
        />

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={e => setInStockOnly(e.target.checked)}
          />
          Only in-stock
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <input
            type="checkbox"
            checked={sortPriceAsc}
            onChange={e => setSortPriceAsc(e.target.checked)}
          />
          Sort price ascending
        </label>
      </div>

      <button
        onClick={handleSearch}
        style={{
          backgroundColor: '#0f0',
          color: '#000',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '1rem',
        }}
      >
        Search
      </button>

      {loading && <p style={{ color: '#0f0' }}>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '2rem',
      }}>
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          !loading && <p style={{ color: '#0f0' }}>No products found</p>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '0.4rem',
  backgroundColor: '#111',
  color: '#0f0',
  border: '1px solid #0f0',
  borderRadius: '4px',
  minWidth: '140px',
};
