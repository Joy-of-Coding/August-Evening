import React, { useState } from "react";

interface UserProfileProps {
  onSave: (name: string) => void;
  initialName?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ onSave, initialName }) => {
  const defaultImage = "https://thumb.ac-illust.com/8a/8abc6308b0fdc74c612b769383d2ad7e_t.jpeg";
  const handleResetImage = () => {
    setImageUrl(defaultImage);
    localStorage.setItem('budgetBuddyProfileImage', defaultImage);
  };
  const [name, setName] = useState(initialName || "");
  const [imageUrl, setImageUrl] = useState<string | null>(() => localStorage.getItem('budgetBuddyProfileImage') || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const imgData = ev.target?.result as string;
        setImageUrl(imgData);
        localStorage.setItem('budgetBuddyProfileImage', imgData);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: 32, background: "#334155", borderRadius: 16, color: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
      <h2 style={{ marginBottom: 24, textAlign: 'center', fontSize: '2em', fontWeight: 700 }}>User Profile</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
        <div
          style={{ width: 120, height: 120, borderRadius: '50%', background: '#fff', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={handleImageClick}
          title="Click to select profile image"
        >
          {imageUrl ? (
            <img src={imageUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ color: '#334155', fontSize: '1.5em' }}>Select Image</span>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
      <label style={{ display: "block", marginBottom: 8 }}>Enter your name:</label>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ padding: 8, fontSize: "1em", borderRadius: 6, border: "1px solid #fff", width: "100%", marginBottom: 24 }}
      />
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        <button
          onClick={() => onSave(name)}
          style={{ padding: "8px 24px", fontSize: "1em", borderRadius: 6, background: "#fff", color: "#334155", fontWeight: 700, border: "none", cursor: "pointer" }}
        >
          Save & Return
        </button>
        <button
          onClick={handleResetImage}
          style={{ padding: "8px 24px", fontSize: "1em", borderRadius: 6, background: "#fff", color: "#334155", fontWeight: 700, border: "none", cursor: "pointer" }}
        >
          Reset Image
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
