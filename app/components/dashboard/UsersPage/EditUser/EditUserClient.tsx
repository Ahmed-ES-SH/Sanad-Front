"use client";

import { useState } from "react";
import { User } from "@/app/types/user";
import { Locale } from "@/app/types/global";
import { getTranslations } from "@/app/helpers/getTranslations";
import { useEditUserForm } from "@/app/hooks/useEditUserForm";

// Child Components
import EditUserHeader from "./EditUserHeader";
import BasicInfoCard from "./BasicInfoCard";
import SecurityRoleCard from "./SecurityRoleCard";
import UserInfoSidebar from "./UserInfoSidebar";
import DangerZoneCard from "./DangerZoneCard";
import AvatarModal from "./AvatarModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface EditUserClientProps {
  user: User;
  locale: Locale;
}

export default function EditUserClient({ user, locale }: EditUserClientProps) {
  const t = getTranslations(locale);
  const translations = t.UsersPage.EditUser;

  const {
    formData,
    isSubmitting,
    isDeleting,
    handleChange,
    handleRoleChange,
    handleUpdate,
    handleDelete,
    updateAvatar,
  } = useEditUserForm({ user, locale });

  // Modal states
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState(formData.avatar || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Handle password change separately (different signature)
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange("password")(e);
  };

  // Save avatar from modal
  const handleAvatarSave = (url: string) => {
    updateAvatar(url);
    setShowAvatarModal(false);
    setNewAvatarUrl(url);
  };

  // Reset avatar URL on modal close
  const handleAvatarClose = () => {
    setShowAvatarModal(false);
    setNewAvatarUrl(formData.avatar || "");
  };

  return (
    <div>
      {/* Page Header */}
      <EditUserHeader locale={locale} />

      <form onSubmit={handleUpdate}>
        <div className="grid grid-cols-12 gap-8">
          {/* Main Form Column */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <BasicInfoCard
              user={user}
              formData={formData}
              locale={locale}
              onChange={handleChange}
              onAvatarClick={() => setShowAvatarModal(true)}
            />

            <SecurityRoleCard
              formData={formData}
              locale={locale}
              onPasswordChange={handlePasswordChange}
              onRoleChange={handleRoleChange}
            />
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <UserInfoSidebar user={user} locale={locale} />
            <DangerZoneCard
              locale={locale}
              onDeleteClick={() => setShowDeleteConfirm(true)}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-10 pt-6 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2.5 text-stone-500 text-sm font-medium hover:text-stone-800 transition-colors"
          >
            {translations.actions.cancel}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-10 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {translations.actions.saving}
              </span>
            ) : (
              translations.actions.save
            )}
          </button>
        </div>
      </form>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <AvatarModal
          isOpen={showAvatarModal}
          avatarUrl={newAvatarUrl}
          locale={locale}
          onClose={handleAvatarClose}
          onSave={handleAvatarSave}
          onChange={setNewAvatarUrl}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        userName={user.name || ""}
        userEmail={user.email}
        locale={locale}
        isDeleting={isDeleting}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
