import { useEffect, useState } from "react";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject, getStorage } from "firebase/storage";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function Gallery() {
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageId, setSelectedImageId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const photosRef = collection(db, "photos");
      const q = query(photosRef, where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setImages(data);
    };

    fetchData();
  }, [user]);

  const handleDelete = async (image) => {
    const confirm = window.confirm("Are you sure you want to delete this image?");
    if (!confirm) return;

    try {
      const storage = getStorage();
      const storageRef = ref(storage, image.storagePath);
      await deleteObject(storageRef);
      await deleteDoc(doc(db, "photos", image.id));
      setImages((prev) => prev.filter((img) => img.id !== image.id));
      alert("Image deleted successfully!");
    } catch (err) {
      console.error("Failed to delete image:", err);
      alert("Error deleting image.");
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative group cursor-pointer"
            onClick={() => {
              if (window.innerWidth < 640) {
                setSelectedImageId(selectedImageId === img.id ? null : img.id);
              } else {
                setSelectedImage(img.url);
              }
            }}
          >
            <img
              src={img.url}
              alt="user-pic"
              className="rounded shadow-lg w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(img);
              }}
              className={`absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded 
                          transition-opacity duration-300
                          opacity-0 group-hover:opacity-100
                          ${selectedImageId === img.id ? "opacity-100" : ""}`}
            >
              🗑 Delete
            </button>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full View"
            className="max-w-full max-h-full rounded-lg transform transition duration-300 scale-0 animate-pop"
          />
        </div>
      )}

      <style>{`
        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop {
          animation: pop 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}

export default Gallery;
