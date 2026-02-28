import React from 'react';
import { Tag } from 'lucide-react';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card glass-panel">
            <span className="category-badge">{product.category}</span>
            {product.image && (
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    loading="lazy"
                />
            )}
            <div className="product-info">
                <h3>{product.name}</h3>
                <div className="product-price">${product.price.toFixed(2)}</div>
                <p className="product-desc">{product.description}</p>

                <div className="tags">
                    {product.tags && product.tags.map((tag, idx) => (
                        <span key={idx} className="tag">
                            <Tag size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
