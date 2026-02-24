import React from 'react';

const ProfileCard = ({ user }) => {
  if (!user) {
    return (
      <div className="bg-[var(--card)] p-6 rounded-[28px] border border-[var(--input-border)] shadow-sm">
        <p className="text-[var(--text-secondary)] text-center text-sm">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card)] p-6 rounded-[28px] border border-[var(--input-border)] shadow-sm hover:shadow-xl transition-all duration-300">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-indigo-500 text-white rounded-2xl flex items-center justify-center text-xl font-bold overflow-hidden">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </span>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">
            {user.role}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3 text-sm">
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Phone" value={user.phone} />
        <InfoRow label="Company" value={user.company} />
        <InfoRow label="Location" value={user.location} />
        <InfoRow label="Status" value={user.status} status />
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, status }) => (
  <div className="flex justify-between items-center">
    <span className="text-[var(--text-secondary)] text-xs uppercase tracking-widest">
      {label}
    </span>

    {status ? (
      <span
        className={`px-2 py-1 rounded-full text-[10px] font-bold ${
          value?.toLowerCase() === 'active'
            ? 'bg-emerald-500/10 text-emerald-500'
            : 'bg-gray-500/10 text-gray-500'
        }`}
      >
        {value}
      </span>
    ) : (
      <span className="text-[var(--text-primary)] font-medium text-sm">
        {value}
      </span>
    )}
  </div>
);

export default ProfileCard;
