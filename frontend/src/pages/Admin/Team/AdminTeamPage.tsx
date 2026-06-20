import { Edit, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { getStoredAdmin } from "../../../services/auth.service";
import {
  createAdminTeamMember,
  deleteAdminTeamMember,
  getAdminTeamMembers,
  updateAdminTeamMember,
} from "../../../services/team.service";
import { uploadSingleImage } from "../../../services/uploads.service";
import type {
  CreateTeamMemberPayload,
  TeamMemberImage,
  TeamMemberItem,
} from "../../../types/team.types";
import { hasPermission } from "../../../utils/permissions";
import {
  initialTeamFormState,
  type TeamFormState,
} from "./adminTeamForm.types";
import { AdminTeamMemberForm } from "./components/AdminTeamMemberForm";

export const AdminTeamPage = () => {
  const admin = getStoredAdmin();

  const canCreateTeamMember = hasPermission(admin, "team", "create");
  const canUpdateTeamMember = hasPermission(admin, "team", "update");
  const canDeleteTeamMember = hasPermission(admin, "team", "delete");

  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [formState, setFormState] =
    useState<TeamFormState>(initialTeamFormState);
  const [selectedImage, setSelectedImage] = useState<TeamMemberImage | null>(
    null,
  );

  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editFormState, setEditFormState] =
    useState<TeamFormState>(initialTeamFormState);
  const [editSelectedImage, setEditSelectedImage] =
    useState<TeamMemberImage | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await getAdminTeamMembers();
        setMembers(data);
      } catch {
        setErrorMessage("Could not load team members.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadMembers();
  }, []);

  const updateCreateField = (
    fieldName: keyof TeamFormState,
    value: string | boolean,
  ) => {
    setFormState((currentState) => ({
      ...currentState,
      [fieldName]: value,
    }));
  };

  const updateEditField = (
    fieldName: keyof TeamFormState,
    value: string | boolean,
  ) => {
    setEditFormState((currentState) => ({
      ...currentState,
      [fieldName]: value,
    }));
  };

  const handleUploadCreateImage = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const imageFile = event.target.files?.[0];

    if (!imageFile) {
      return;
    }

    setIsUploadingImage(true);
    setErrorMessage("");

    try {
      const uploadedImage = await uploadSingleImage(imageFile);
      setSelectedImage(uploadedImage);
      setMessageText("Image uploaded successfully.");
    } catch {
      setErrorMessage("Could not upload image.");
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleUploadEditImage = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const imageFile = event.target.files?.[0];

    if (!imageFile) {
      return;
    }

    setIsUploadingImage(true);
    setErrorMessage("");

    try {
      const uploadedImage = await uploadSingleImage(imageFile);
      setEditSelectedImage(uploadedImage);
      setMessageText("Image uploaded successfully.");
    } catch {
      setErrorMessage("Could not upload image.");
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  const buildPayload = (
    state: TeamFormState,
    image: TeamMemberImage | null,
  ): CreateTeamMemberPayload => {
    return {
      fullName: state.fullName,
      role: {
        de: state.roleDe,
        en: state.roleEn,
        ar: state.roleAr,
      },
      biography: {
        de: state.biographyDe,
        en: state.biographyEn,
        ar: state.biographyAr,
      },
      image: image || undefined,
      email: state.email,
      instagramUrl: state.instagramUrl,
      facebookUrl: state.facebookUrl,
      linkedinUrl: state.linkedinUrl,
      sortOrder: Number(state.sortOrder) || 0,
      isFeatured: state.isFeatured,
    };
  };

  const handleCreateMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canCreateTeamMember) {
      setErrorMessage("You do not have permission to create team members.");
      return;
    }

    setIsSaving(true);
    setMessageText("");
    setErrorMessage("");

    try {
      const createdMember = await createAdminTeamMember(
        buildPayload(formState, selectedImage),
      );

      setMembers((currentMembers) => [createdMember, ...currentMembers]);
      setFormState(initialTeamFormState);
      setSelectedImage(null);
      setMessageText("Team member created successfully.");
    } catch {
      setErrorMessage("Could not create team member.");
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (member: TeamMemberItem) => {
    setEditingMemberId(member._id);
    setEditFormState({
      fullName: member.fullName,
      roleDe: member.role.de,
      roleEn: member.role.en,
      roleAr: member.role.ar,
      biographyDe: member.biography?.de || "",
      biographyEn: member.biography?.en || "",
      biographyAr: member.biography?.ar || "",
      email: member.email || "",
      instagramUrl: member.instagramUrl || "",
      facebookUrl: member.facebookUrl || "",
      linkedinUrl: member.linkedinUrl || "",
      sortOrder: String(member.sortOrder || 0),
      isFeatured: member.isFeatured,
    });
    setEditSelectedImage(member.image || null);
    setMessageText("");
    setErrorMessage("");
  };

  const cancelEditing = () => {
    setEditingMemberId(null);
    setEditFormState(initialTeamFormState);
    setEditSelectedImage(null);
  };

  const handleSaveEdit = async (memberId: string) => {
    if (!canUpdateTeamMember) {
      setErrorMessage("You do not have permission to update team members.");
      return;
    }

    setIsSaving(true);
    setMessageText("");
    setErrorMessage("");

    try {
      const updatedMember = await updateAdminTeamMember(
        memberId,
        buildPayload(editFormState, editSelectedImage),
      );

      setMembers((currentMembers) =>
        currentMembers.map((member) =>
          member._id === updatedMember._id ? updatedMember : member,
        ),
      );

      cancelEditing();
      setMessageText("Team member updated successfully.");
    } catch {
      setErrorMessage("Could not update team member.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!canDeleteTeamMember) {
      setErrorMessage("You do not have permission to delete team members.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this team member?",
    );

    if (!confirmed) {
      return;
    }

    setMessageText("");
    setErrorMessage("");

    try {
      await deleteAdminTeamMember(memberId);
      setMembers((currentMembers) =>
        currentMembers.filter((member) => member._id !== memberId),
      );
      setMessageText("Team member deleted successfully.");
    } catch {
      setErrorMessage("Could not delete team member.");
    }
  };

  return (
    <section>
      <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
        Team
      </p>

      <h1 className="mt-4 text-4xl font-black tracking-tight">Manage Team</h1>

      <p className="mt-4 text-zinc-400">
        Add, edit and delete team members from here.
      </p>

      <p className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4 text-sm font-bold text-violet-200">
        Hint: max image size is 10MB. Recommended width: 1600–2000px.
      </p>

      {messageText && (
        <p className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-300">
          {messageText}
        </p>
      )}

      {errorMessage && (
        <p className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-300">
          {errorMessage}
        </p>
      )}

      {canCreateTeamMember ? (
        <form
          onSubmit={handleCreateMember}
          className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="flex items-center gap-3">
            <Plus className="text-violet-300" size={24} />
            <h2 className="text-2xl font-black">Add Team Member</h2>
          </div>

          <AdminTeamMemberForm
            formState={formState}
            image={selectedImage}
            isUploadingImage={isUploadingImage}
            onFieldChange={updateCreateField}
            onImageChange={setSelectedImage}
            onUploadImage={handleUploadCreateImage}
          />

          <button
            type="submit"
            disabled={isSaving || isUploadingImage}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />
            {isSaving ? "Creating..." : "Create Member"}
          </button>
        </form>
      ) : (
        <p className="mt-10 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm font-bold text-yellow-300">
          You do not have permission to create team members.
        </p>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-black">Team Members</h2>

        {isLoading && (
          <p className="mt-6 text-zinc-400">Loading team members...</p>
        )}

        {!isLoading && members.length === 0 && (
          <p className="mt-6 text-zinc-400">No team members found.</p>
        )}

        {!isLoading && members.length > 0 && (
          <div className="mt-6 grid gap-6">
            {members.map((member) => {
              const isEditing = editingMemberId === member._id;

              return (
                <article
                  key={member._id}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
                >
                  {isEditing ? (
                    <>
                      <AdminTeamMemberForm
                        formState={editFormState}
                        image={editSelectedImage}
                        isUploadingImage={isUploadingImage}
                        onFieldChange={updateEditField}
                        onImageChange={setEditSelectedImage}
                        onUploadImage={handleUploadEditImage}
                      />

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => void handleSaveEdit(member._id)}
                          disabled={isSaving || isUploadingImage}
                          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-black text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Save size={17} />
                          {isSaving ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-bold text-zinc-300 transition hover:border-zinc-400 hover:text-white"
                        >
                          <X size={17} />
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="grid gap-6 lg:grid-cols-[180px_1fr_auto]">
                      <div className="overflow-hidden rounded-3xl bg-black/30">
                        {member.image ? (
                          <img
                            src={member.image.url}
                            alt={member.fullName}
                            className="h-44 w-full object-cover"
                          />
                        ) : (
                          <div className="grid h-44 place-items-center text-sm text-zinc-500">
                            No image
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-black">
                            {member.fullName}
                          </h3>

                          {member.isFeatured && (
                            <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-black uppercase text-violet-300">
                              Featured
                            </span>
                          )}

                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-zinc-400">
                            Order: {member.sortOrder}
                          </span>
                        </div>

                        <p className="mt-2 font-bold text-violet-300">
                          {member.role.de}
                        </p>

                        {member.biography?.de && (
                          <p className="mt-4 max-w-3xl leading-7 text-zinc-400">
                            {member.biography.de}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-500">
                          {member.email && <span>{member.email}</span>}
                          {member.instagramUrl && <span>Instagram</span>}
                          {member.facebookUrl && <span>Facebook</span>}
                          {member.linkedinUrl && <span>LinkedIn</span>}
                        </div>
                      </div>

                      <div className="flex gap-2 lg:justify-end">
                        {canUpdateTeamMember ? (
                          <button
                            type="button"
                            onClick={() => startEditing(member)}
                            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-violet-400 hover:text-violet-300"
                            aria-label="Edit team member"
                          >
                            <Edit size={17} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            title="You do not have permission to edit team members"
                            className="grid h-10 w-10 cursor-not-allowed place-items-center rounded-full border border-white/10 text-zinc-600 opacity-50"
                            aria-label="Edit disabled"
                          >
                            <Edit size={17} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => void handleDeleteMember(member._id)}
                          disabled={!canDeleteTeamMember}
                          title={
                            canDeleteTeamMember
                              ? undefined
                              : "You do not have permission to delete team members"
                          }
                          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-red-400 hover:text-red-300 disabled:cursor-not-allowed disabled:text-zinc-600 disabled:opacity-50"
                          aria-label="Delete team member"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
