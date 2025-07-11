import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Styled Components
const AdminDashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background-color: #f5f7fa;
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e1e5eb;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 2rem;
  margin: 0;
  font-weight: 600;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CardTitle = styled.h3`
  color: #7f8c8d;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CardValue = styled.p`
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
`;

const Section = styled.section`
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: #f8f9fa;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  &:hover {
    background-color: #f1f3f5;
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  color: #495057;
  font-weight: 600;
  border-bottom: 2px solid #e1e5eb;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e1e5eb;
  color: #495057;
`;

const EmailCell = styled(TableCell)`
  color: #3498db;
  font-weight: 500;
`;

const RoleCell = styled(TableCell)`
  text-transform: capitalize;
`;

const ActionCell = styled(TableCell)`
  text-align: right;
`;

const PostContent = styled.div`
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    background: linear-gradient(135deg, #2980b9, #3498db);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const DeleteButton = styled.button`
  background: #fff;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;

  &:hover {
    background: #e74c3c;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
  text-align: center;
  animation: ${fadeIn} 0.3s ease;
`;

const ModalTitle = styled.h3`
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 1rem;
`;

const ModalMessage = styled.p`
  color: #495057;
  margin-bottom: 2rem;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ConfirmButton = styled(ModalButton)`
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
`;

const CancelButton = styled(ModalButton)`
  background: #f8f9fa;
  color: #495057;
  border: 1px solid #e1e5eb;
`;

const Message = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: ${slideIn} 0.3s ease, ${fadeOut} 0.5s ease 3s forwards;
  ${props => props.type === 'success' && css`
    background: linear-gradient(135deg, #2ecc71, #27ae60);
  `}
  ${props => props.type === 'error' && css`
    background: linear-gradient(135deg, #e74c3c, #c0392b);
  `}
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #3498db;
  animation: ${spin} 1s ease-in-out infinite;
  margin: 2rem auto;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 2rem;
`;

function AdminDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const fetchData = async () => {
    try {
      const [usersRes, postsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/posts", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setUsers(usersRes.data);
      setPosts(postsRes.data);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
      return;
    }

    fetchData();
  }, [navigate, token, role]);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleDeleteUser = (id) => {
    setModalConfig({
      title: 'Delete User',
      message: 'Are you sure you want to delete this user account? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(users.filter((user) => user._id !== id));
          showMessage('User deleted successfully!', 'success');
        } catch (err) {
          showMessage('Failed to delete user', 'error');
        }
        setShowModal(false);
      },
      onCancel: () => setShowModal(false)
    });
    setShowModal(true);
  };

  const handleDeletePost = (id) => {
    setModalConfig({
      title: 'Delete Post',
      message: 'Are you sure you want to delete this post? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/posts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPosts(posts.filter((post) => post._id !== id));
          showMessage('Post deleted successfully!', 'success');
        } catch (err) {
          showMessage('Failed to delete post', 'error');
        }
        setShowModal(false);
      },
      onCancel: () => setShowModal(false)
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <p>Loading admin dashboard...</p>
      </LoadingContainer>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <AdminDashboardContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <PrimaryButton onClick={() => navigate("/")}>
          Back to Home
        </PrimaryButton>
      </Header>

      <CardsContainer>
        <Card>
          <CardTitle>Total Users</CardTitle>
          <CardValue>{users.length}</CardValue>
        </Card>
        <Card>
          <CardTitle>Total Posts</CardTitle>
          <CardValue>{posts.length}</CardValue>
        </Card>
      </CardsContainer>

      <Section>
        <SectionHeader>
          <SectionTitle>User Management</SectionTitle>
        </SectionHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Username</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Role</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <EmailCell>{user.email}</EmailCell>
                <RoleCell>{user.role}</RoleCell>
                <ActionCell>
                  <DeleteButton onClick={() => handleDeleteUser(user._id)}>
                    Delete
                  </DeleteButton>
                </ActionCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Post Management</SectionTitle>
        </SectionHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Title</TableHeaderCell>
              <TableHeaderCell>Author</TableHeaderCell>
              <TableHeaderCell>Content</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {posts.map((post) => (
              <TableRow key={post._id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.user?.username || "Unknown"}</TableCell>
                <TableCell>
                  <PostContent>{post.description}</PostContent>
                </TableCell>
                <ActionCell>
                  <DeleteButton onClick={() => handleDeletePost(post._id)}>
                    Delete
                  </DeleteButton>
                </ActionCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Section>

      {showModal && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>{modalConfig.title}</ModalTitle>
            <ModalMessage>{modalConfig.message}</ModalMessage>
            <ModalButtons>
              <CancelButton onClick={modalConfig.onCancel}>
                Cancel
              </CancelButton>
              <ConfirmButton onClick={modalConfig.onConfirm}>
                Delete
              </ConfirmButton>
            </ModalButtons>
          </ModalBox>
        </ModalOverlay>
      )}

      {message.text && (
        <Message type={message.type}>
          {message.text}
        </Message>
      )}
    </AdminDashboardContainer>
  );
}

export default AdminDashboard;