// ── CreateGroupModal.jsx ────────────────────────────────────────────
// Modal form to create a new friend group.

import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createGroup } from "../services/firebase";

export default function CreateGroupModal({ isOpen, onClose, onSuccess }) {
  const { currentUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [memberEmails, setMemberEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Group name is required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // For now, members is just the creator. In a full app,
      // you'd resolve emails to UIDs via a Firestore query.
      const members = [currentUser.uid];
      const emailList = memberEmails
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);

      await createGroup({
        name: name.trim(),
        description: description.trim(),
        members,
        memberEmails: emailList,
        createdBy: currentUser.uid,
      });

      setName("");
      setDescription("");
      setMemberEmails("");
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} id="create-group-modal">
        <div className="modal-header">
          <h2 className="modal-title">Create New Group</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="group-name" className="form-label">Group Name *</label>
            <input
              id="group-name"
              type="text"
              className="form-input"
              placeholder="e.g., Goa Trip 2026"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="group-desc" className="form-label">Description</label>
            <input
              id="group-desc"
              type="text"
              className="form-input"
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="member-emails" className="form-label">
              Member Emails (comma separated)
            </label>
            <textarea
              id="member-emails"
              className="form-input form-textarea"
              placeholder="alice@email.com, bob@email.com"
              value={memberEmails}
              onChange={(e) => setMemberEmails(e.target.value)}
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
