import React from 'react';
import { NEW_CATEGORY_OPTION } from './constants';

interface Props {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  showAddCategory: boolean;
  setShowAddCategory: (show: boolean) => void;
  newCategory: string;
  setNewCategory: (val: string) => void;
  addNewCategory: () => void;
  removeCategory: (name: string) => void;
  canRemove: (name: string) => boolean;
  getAccentColor: () => string;
}

const CategoryManager: React.FC<Props> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  showAddCategory,
  setShowAddCategory,
  newCategory,
  setNewCategory,
  addNewCategory,
  removeCategory,
  canRemove,
  getAccentColor,
}) => {
  return (
    <div style={{ 
      marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: 8,
      border: `1px solid ${getAccentColor()}`
    }}>
      <h3 style={{ marginBottom: 10, fontSize: 16, color: getAccentColor() }}>Manage Categories</h3>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <select
          value={selectedCategory || ''}
          onChange={(e) => {
            const value = e.target.value;
            if (value === NEW_CATEGORY_OPTION) {
              setShowAddCategory(true);
              return;
            }
            setSelectedCategory(value);
          }}
          style={{ padding: '8px 12px', border: '1px solid #ced4da', borderRadius: 4, fontSize: 14, minWidth: 220 }}
        >
          <option value="" disabled>Select category…</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
          <option value={NEW_CATEGORY_OPTION}>+ New category…</option>
        </select>
        <button
          onClick={() => removeCategory(selectedCategory)}
          disabled={!selectedCategory || !canRemove(selectedCategory)}
          style={{
            background: (!selectedCategory || !canRemove(selectedCategory)) ? '#6c757d' : '#dc3545',
            color: 'white', border: 'none', borderRadius: 4, padding: '8px 12px', cursor: (!selectedCategory || !canRemove(selectedCategory)) ? 'not-allowed' : 'pointer', fontSize: 14
          }}
        >
          − Remove
        </button>
        {showAddCategory ? (
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              style={{ padding: '8px 12px', border: '1px solid #ced4da', borderRadius: 4, fontSize: 14 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addNewCategory();
                if (e.key === 'Escape') setShowAddCategory(false);
              }}
            />
            <button
              onClick={addNewCategory}
              style={{ background: getAccentColor(), color: 'white', border: 'none', borderRadius: 4, padding: '8px 12px', cursor: 'pointer', fontSize: 14 }}
            >
              + Add
            </button>
            <button
              onClick={() => setShowAddCategory(false)}
              style={{ background: '#6c757d', color: 'white', border: 'none', borderRadius: 4, padding: '8px 12px', cursor: 'pointer', fontSize: 14 }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddCategory(true)}
            style={{ background: getAccentColor(), color: 'white', border: 'none', borderRadius: 4, padding: '8px 12px', cursor: 'pointer', fontSize: 14 }}
          >
            + New Category
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;

