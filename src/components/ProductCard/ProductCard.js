// Componente ProductCard
const ProductCard = ({ product, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '15px', 
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        {!imageError && product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#eee',
            color: '#999',
            fontSize: '32px',
            fontWeight: 'bold'
          }}>
            {product.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
      <p style={{ margin: '5px 0', color: '#666' }}>Categoría: {product.category}</p>
      <p style={{ margin: '5px 0', color: '#666' }}>Color: {product.color}</p>
      
      <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#e91e63' }}>Precio: ${parseFloat(product.price).toFixed(2)}</p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
        <button onClick={() => onEdit(product)} 
          style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>
          Editar
        </button>
        <button onClick={() => onDelete(product._id)}
          style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>
          Eliminar
        </button>
      </div>
    </div>
  );
};