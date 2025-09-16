// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Modal,
  TextField,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API } from "../config/API_CONFIG";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [tenant, setTenant] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loadingTenant, setLoadingTenant] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [error, setError] = useState("");

  // Create Note Modal states
  const [openModal, setOpenModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [creatingNote, setCreatingNote] = useState(false);

  // Edit Note Modal states
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [updatingNote, setUpdatingNote] = useState(false);

  // Add Member
  const [memberEmail, setMemberEmail] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  // Guard
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  // Fetch tenant info
  useEffect(() => {
    if (!user?.tenantId?._id) return;

    const fetchTenant = async () => {
      setLoadingTenant(true);
      try {
        const res = await fetch(API.tenants.getMyTenant(user.tenantId.slug), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch tenant");
        setTenant(data.tenant);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingTenant(false);
      }
    };

    fetchTenant();
  }, [user?.tenantId?._id, token]);

  // Fetch notes
  useEffect(() => {
    if (!user?.tenantId?._id) return;

    const fetchNotes = async () => {
      setLoadingNotes(true);
      try {
        const res = await fetch(API.notes.fetchAll, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch notes");
        setNotes(data.allNotes || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingNotes(false);
      }
    };

    fetchNotes();
  }, [user?.tenantId?._id, token]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // Create Note
  const handleCreateNote = async () => {
    if (!noteTitle || !noteContent) return;

    setCreatingNote(true);
    try {
      const res = await fetch(API.notes.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: noteTitle, content: noteContent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create note");
      setNotes((prev) => [data.newNote, ...prev]);
      setOpenModal(false);
      setNoteTitle("");
      setNoteContent("");
    } catch (err) {
      alert(err.message);
    } finally {
      setCreatingNote(false);
    }
  };

  // Add Member
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberEmail || !tenant) return;

    setAddingMember(true);
    try {
      const res = await fetch(API.tenants.addMember(tenant.slug), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: memberEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add member");

      alert(`${memberEmail} added successfully!`);
      setMemberEmail("");
    } catch (err) {
      alert(err.message);
    } finally {
      setAddingMember(false);
    }
  };

  // Upgrade Plan
  const handleUpgrade = async () => {
    if (!tenant) return;
    try {
      const res = await fetch(API.tenants.upgrade(tenant.slug), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upgrade failed");
      setTenant(data.tenant);
      alert("Tenant upgraded to Pro successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpgradeRedirect = () => {
    if (user.role === "Admin") {
      handleUpgrade();
    } else {
      alert(
        "The subscription has expired, please ask your admin to upgrade to Pro."
      );
    }
  };

  const openEdit = (note) => {
    setEditingNoteId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setOpenEditModal(true);
  };

  const handleEditNote = async () => {
    if (!editTitle && !editContent) return;

    setUpdatingNote(true);
    try {
      const res = await fetch(API.notes.update(editingNoteId), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update note");

      setNotes((prev) =>
        prev.map((note) =>
          note._id === editingNoteId ? data.updatedNote : note
        )
      );
      setOpenEditModal(false);
      setEditingNoteId(null);
      setEditTitle("");
      setEditContent("");
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const res = await fetch(API.notes.delete(noteId), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete note");

      // remove from state
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      alert("Note deleted successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const showUpgradeInsteadOfAddNote =
    tenant?.subscription !== "Pro" && notes.length >= 3;

  return (
    <Container sx={{ mt: 4 }}>
      {/* Header Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Dashboard</Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Tenant Info */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Tenant Information
        </Typography>

        {loadingTenant ? (
          <CircularProgress />
        ) : user?.tenantId ? (
          tenant ? (
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6">{tenant.companyName}</Typography>
                <Typography variant="body2">
                  Tenant Plan: {tenant.subscription || "Free"}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Failed to load tenant info.
            </Typography>
          )
        ) : (
          <Typography variant="body2" color="text.secondary">
            You are not part of any tenant yet. Contact your administrator to
            add you in a tenant.
          </Typography>
        )}
      </Box>

      {/* Add Member (Admins only) */}
      {tenant && user.role === "Admin" && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Add Member to Tenant
          </Typography>
          <form onSubmit={handleAddMember}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Enter user email"
                fullWidth
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={addingMember || !memberEmail}
              >
                {addingMember ? "Adding..." : "Add"}
              </Button>
            </Stack>
          </form>
        </Box>
      )}

      {/* Notes Section */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Notes
        </Typography>

        {showUpgradeInsteadOfAddNote ? (
          <Button
            variant="contained"
            color="secondary"
            sx={{ mb: 2 }}
            onClick={handleUpgradeRedirect}
          >
            Upgrade to Pro
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
            onClick={() => setOpenModal(true)}
          >
            Add Note
          </Button>
        )}

        {loadingNotes ? (
          <CircularProgress />
        ) : notes.length > 0 ? (
          <Grid container spacing={2}>
            {notes.map((note) => (
              <Grid item xs={12} sm={6} md={4} key={note._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      {note.title || "Untitled"}
                    </Typography>
                    <Typography variant="body2">
                      {note.content || "No content"}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Created by: {note.createdBy?.name || "Unknown"}
                    </Typography>

                    {/* Edit (if creator) */}
                    {note.createdBy?._id === user._id && (
                      <Button
                        size="small"
                        sx={{ mt: 1, mr: 1 }}
                        onClick={() => openEdit(note)}
                      >
                        Edit
                      </Button>
                    )}

                    {/* Delete (if Admin OR creator) */}
                    {(user.role === "Admin" || note.createdBy?._id === user._id) && (
                      <Button
                        size="small"
                        color="error"
                        sx={{ mt: 1 }}
                        onClick={() => handleDeleteNote(note._id)}
                      >
                        Delete
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No notes found. Start by creating a note in this tenant.
          </Typography>
        )}
      </Box>

      {/* Create Note Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Create Note
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Title"
              fullWidth
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
            <TextField
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateNote}
              disabled={creatingNote || !noteTitle || !noteContent}
            >
              {creatingNote ? "Creating..." : "Create Note"}
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Edit Note Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit Note
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Title"
              fullWidth
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <TextField
              label="Content"
              fullWidth
              multiline
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditNote}
              disabled={updatingNote || (!editTitle && !editContent)}
            >
              {updatingNote ? "Updating..." : "Save Changes"}
            </Button>
          </Stack>
        </Box>
      </Modal>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Container>
  );
};

export default Dashboard;