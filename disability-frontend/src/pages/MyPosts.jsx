import React, { useEffect, useState } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEdit, 
  faTrash, 
  faSave, 
  faTimes, 
  faImage,
  faUserGroup,
  faHandsHelping,
  faCheckCircle,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Notification Popup
const Notification = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  background: ${props => props.type === 'success' ? '#10b981' : '#ef4444'};
  color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1000;
  animation: ${slideIn} 0.3s ease-out forwards;

  svg {
    font-size: 1.25rem;
  }
`;

// Confirmation Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

// Main Container
const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: white;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

// Title with gradient text
const Title = styled.h2`
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #4f46e5, #06b6d4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
  padding-bottom: 1rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, #4f46e5, #06b6d4);
    border-radius: 2px;
  }

  svg {
    margin-right: 0.75rem;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

// Empty State
const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background: #f8fafc;
  border-radius: 16px;
  margin-top: 1rem;

  svg {
    font-size: 3rem;
    color: #cbd5e1;
    margin-bottom: 1rem;
  }

  h3 {
    color: #64748b;
    margin-bottom: 0.5rem;
  }

  p {
    color: #94a3b8;
    max-width: 500px;
    margin: 0 auto;
  }
`;

// Posts Grid
const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Post Card with hover effect
const PostCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid #e2e8f0;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

// Image Container
const ImageContainer = styled.div`
  width: 100%;
  height: 220px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PostImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${PostCard}:hover & {
    transform: scale(1.1);
  }
`;

const ImagePlaceholder = styled.div`
  font-size: 3rem;
  color: #c7d2fe;
`;

// Post Content
const PostContent = styled.div`
  padding: 1.5rem;

  h3 {
    margin: 0 0 0.75rem 0;
    color: #1e293b;
    font-size: 1.3rem;
    font-weight: 600;
    line-height: 1.4;
  }

  p {
    color: #64748b;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Category Tag
const CategoryTag = styled.span`
  display: inline-flex;
  align-items: center;
  margin-top: 0.6rem;
  background-color: ${props => 
    props.category === "organization" ? "#3b82f6" : 
    props.category === "volunteer" ? "#10b981" : "#8b5cf6"};
  color: white;
  padding: 0.4rem 0.8rem;
  font-size: 0.75rem;
  border-radius: 20px;
  font-weight: 500;
  gap: 0.3rem;
`;

// Button Row
const ButtonRow = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 1.5rem;
`;

// Button Styles
const Button = styled.button`
  flex: 1;
  padding: 0.7rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  color: white;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;

  &.edit {
    background: #4f46e5;
    &:hover {
      background: #4338ca;
      transform: translateY(-2px);
    }
  }

  &.delete {
    background: #ef4444;
    &:hover {
      background: #dc2626;
      transform: translateY(-2px);
    }
  }
`;

// Edit Form
const EditForm = styled.form`
  padding: 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: ${fadeIn} 0.3s ease-out;

  input,
  textarea,
  select {
    padding: 0.75rem;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    resize: vertical;
    transition: all 0.2s ease;
    background: white;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: #4f46e5;
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }
  }

  textarea {
    min-height: 100px;
  }

  select {
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem;
`;

const PrimaryButton = styled.button`
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #4338ca;
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(PrimaryButton)`
  background-color: #64748b;
  &:hover {
    background-color: #475569;
  }
`;

// Loading Skeleton
const SkeletonCard = styled.div`
  background: #f1f5f9;
  border-radius: 16px;
  overflow: hidden;
  height: 400px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
    animation: ${pulse} 1.5s infinite;
  }
`;

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editPostId, setEditPostId] = useState(null);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    category: "",
    image: null
  });
  const [notification, setNotification] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const token = localStorage.getItem("token");

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchMyPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/posts/myposts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(res.data);
    } catch (err) {
      setError("Failed to fetch your posts. Please try again later.");
      showNotification("Failed to fetch your posts", 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const confirmDelete = (post) => {
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((post) => post._id !== postToDelete._id));
      showNotification("Post deleted successfully");
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Failed to delete post",
        'error'
      );
    } finally {
      setShowDeleteModal(false);
      setPostToDelete(null);
    }
  };

  const startEdit = (post) => {
    setEditPostId(post._id);
    setEditData({
      title: post.title,
      description: post.description,
      category: post.category?.title || "",
      image: post.image?.url || null
    });
  };

  const cancelEdit = () => {
    setEditPostId(null);
    setEditData({ title: "", description: "", category: "", image: null });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', editData.title);
      formData.append('description', editData.description);
      formData.append('category', editData.category);
      
      if (e.target.image.files[0]) {
        formData.append('image', e.target.image.files[0]);
      }

      const res = await axios.put(
        `http://localhost:5000/api/posts/${editPostId}`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      
      setPosts((prev) =>
        prev.map((post) =>
          post._id === editPostId ? res.data.updatedPost : post
        )
      );
      cancelEdit();
      showNotification("Post updated successfully");
    } catch (err) {
      showNotification(
        err.response?.data?.message || "Failed to update post",
        'error'
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case "organization":
        return faUserGroup;
      case "volunteer":
        return faHandsHelping;
      default:
        return faImage;
    }
  };

  return (
    <>
      {/* Notification Popup */}
      {notification && (
        <Notification type={notification.type}>
          <FontAwesomeIcon 
            icon={notification.type === 'success' ? faCheckCircle : faExclamationCircle} 
          />
          {notification.message}
        </Notification>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete the post "{postToDelete?.title}"? This action cannot be undone.</p>
            <ModalActions>
              <SecondaryButton onClick={() => setShowDeleteModal(false)}>
                <FontAwesomeIcon icon={faTimes} />
                Cancel
              </SecondaryButton>
              <PrimaryButton onClick={handleDelete} className="delete">
                <FontAwesomeIcon icon={faTrash} />
                Delete
              </PrimaryButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}

      <Container>
        <Title>
          <FontAwesomeIcon icon={faImage} />
          My Posts
        </Title>

        {loading && (
          <PostsGrid>
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </PostsGrid>
        )}

        {error && (
          <EmptyState>
            <FontAwesomeIcon icon={faExclamationCircle} />
            <h3>Something went wrong</h3>
            <p>{error}</p>
          </EmptyState>
        )}

        {!loading && posts.length === 0 && (
          <EmptyState>
            <FontAwesomeIcon icon={faImage} />
            <h3>No Posts Yet</h3>
            <p>You haven't created any posts yet. Start sharing your stories with the community!</p>
          </EmptyState>
        )}

        <PostsGrid>
          {posts.map((post) => (
            <PostCard key={post._id}>
              <ImageContainer>
                {post.image?.url ? (
                  <PostImage src={post.image.url} alt={post.title} />
                ) : (
                  <ImagePlaceholder>
                    <FontAwesomeIcon icon={faImage} />
                  </ImagePlaceholder>
                )}
              </ImageContainer>
              
              <PostContent>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                
                <CategoryTag category={post.category?.title}>
                  <FontAwesomeIcon icon={getCategoryIcon(post.category?.title)} size="xs" />
                  {post.category?.title || "Uncategorized"}
                </CategoryTag>

                <ButtonRow>
                  <Button className="edit" onClick={() => startEdit(post)}>
                    <FontAwesomeIcon icon={faEdit} />
                    Edit
                  </Button>
                  <Button className="delete" onClick={() => confirmDelete(post)}>
                    <FontAwesomeIcon icon={faTrash} />
                    Delete
                  </Button>
                </ButtonRow>

                {editPostId === post._id && (
                  <EditForm onSubmit={submitEdit}>
                    <input
                      type="text"
                      name="title"
                      value={editData.title}
                      onChange={handleChange}
                      placeholder="Post Title"
                      required
                    />
                    
                    <textarea
                      name="description"
                      value={editData.description}
                      onChange={handleChange}
                      placeholder="Write your post description here..."
                      required
                    />
                    
                    <select
                      name="category"
                      value={editData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="disabled">Disabled</option>
                      <option value="organization">Organization</option>
                      <option value="volunteer">Volunteer</option>
                    </select>
                    
                    <div>
                      <label htmlFor="image-upload" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                        Change Image:
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ width: '100%' }}
                      />
                      {editData.image && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <img 
                            src={editData.image} 
                            alt="Preview" 
                            style={{ 
                              maxWidth: '100px', 
                              maxHeight: '100px', 
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0'
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    <FormActions>
                      <PrimaryButton type="submit">
                        <FontAwesomeIcon icon={faSave} />
                        Save Changes
                      </PrimaryButton>
                      <SecondaryButton type="button" onClick={cancelEdit}>
                        <FontAwesomeIcon icon={faTimes} />
                        Cancel
                      </SecondaryButton>
                    </FormActions>
                  </EditForm>
                )}
              </PostContent>
            </PostCard>
          ))}
        </PostsGrid>
      </Container>
    </>
  );
}

export default MyPosts;