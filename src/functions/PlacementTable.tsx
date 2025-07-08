import React, { useState, useEffect } from "react";
import { t } from "i18next";
import { Debate } from "./types";
import "./PlacementTable.css";

interface PlacementTableProps {
  debate: Debate;
  onPlacementChange: (placements: GroupPlacement[]) => void;
  compact?: boolean;
}

export interface GroupPlacement {
  groupId: string;
  groupName: string;
  placement: number;
  points?: number;
  notes?: string;
}

const PlacementTable: React.FC<PlacementTableProps> = ({
  debate,
  onPlacementChange,
  compact = false,
}) => {
  const [placements, setPlacements] = useState<GroupPlacement[]>([]);

  const initializePlacements = () => {
    const groups: GroupPlacement[] = [
      {
        groupId: "OG",
        groupName: t("Home.OG"),
        placement: 1,
        points: 3,
        notes: "",
      },
      {
        groupId: "OO",
        groupName: t("Home.OO"),
        placement: 2,
        points: 2,
        notes: "",
      },
      {
        groupId: "CG",
        groupName: t("Home.CG"),
        placement: 3,
        points: 1,
        notes: "",
      },
      {
        groupId: "CO",
        groupName: t("Home.CO"),
        placement: 4,
        points: 0,
        notes: "",
      },
    ];
    setPlacements(groups);
    onPlacementChange(groups);
  };

  useEffect(() => {
    initializePlacements();
  }, [debate]);

  const updatePlacement = (
    groupId: string,
    field: keyof GroupPlacement,
    value: string | number
  ) => {
    const updatedPlacements = placements.map((group) => {
      if (group.groupId === groupId) {
        return { ...group, [field]: value };
      }
      return group;
    });

    // If placement changed, ensure no duplicates
    if (field === "placement") {
      const newPlacement = Number(value);
      const duplicateGroup = updatedPlacements.find(
        (g) => g.groupId !== groupId && g.placement === newPlacement
      );

      if (duplicateGroup) {
        // Swap placements
        const oldPlacement =
          placements.find((g) => g.groupId === groupId)?.placement || 1;
        updatedPlacements.forEach((group) => {
          if (group.groupId === duplicateGroup.groupId) {
            group.placement = oldPlacement;
          }
        });
      }
    }

    setPlacements(updatedPlacements);
    onPlacementChange(updatedPlacements);
  };

  const getGroupSpeakers = (groupId: string) => {
    switch (groupId) {
      case "OG":
        return [
          { role: "PM", name: debate.PM?.speaker || t("Home.NoSpeaker") },
          { role: "DPM", name: debate.DPM?.speaker || t("Home.NoSpeaker") },
        ];
      case "OO":
        return [
          { role: "LO", name: debate.LO?.speaker || t("Home.NoSpeaker") },
          {
            role: "DLO",
            name: debate.DLO?.speaker || t("Home.NoSpeaker"),
          },
        ];
      case "CG":
        return [
          { role: "MG", name: debate.MG?.speaker || t("Home.NoSpeaker") },
          { role: "GW", name: debate.GW?.speaker || t("Home.NoSpeaker") },
        ];
      case "CO":
        return [
          { role: "MO", name: debate.MO?.speaker || t("Home.NoSpeaker") },
          { role: "OW", name: debate.OW?.speaker || t("Home.NoSpeaker") },
        ];
      default:
        return [];
    }
  };

  const getPlacementColor = (placement: number) => {
    switch (placement) {
      case 1:
        return "#FFD700"; // Gold
      case 2:
        return "#C0C0C0"; // Silver
      case 3:
        return "#CD7F32"; // Bronze
      case 4:
        return "#E5E5E5"; // Gray
      default:
        return "#F0F0F0";
    }
  };

  const sortedPlacements = [...placements].sort(
    (a, b) => a.placement - b.placement
  );

  return (
    <div className={`placement-table-container ${compact ? "compact" : ""}`}>
      <h2 className="placement-title">{t("Home.PlacementTable")}</h2>
      <div className="placement-table-wrapper">
        <table className="placement-table">
          <thead>
            <tr>
              <th>{t("Home.Placement")}</th>
              <th>{t("Home.Group")}</th>
              {!compact && <th>{t("Home.Speakers")}</th>}
              <th>{t("Home.Points")}</th>
              <th>{t("Home.Notes")}</th>
              <th>{t("Home.Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlacements.map((group) => (
              <tr
                key={group.groupId}
                className={`placement-row placement-${group.placement}`}
                style={{
                  backgroundColor: `${getPlacementColor(group.placement)}20`,
                }}
              >
                <td className="placement-cell">
                  <select
                    value={group.placement}
                    onChange={(e) =>
                      updatePlacement(
                        group.groupId,
                        "placement",
                        Number(e.target.value)
                      )
                    }
                    className="placement-select"
                    style={{
                      backgroundColor: getPlacementColor(group.placement),
                    }}
                  >
                    <option value={1}>1st</option>
                    <option value={2}>2nd</option>
                    <option value={3}>3rd</option>
                    <option value={4}>4th</option>
                  </select>
                </td>
                <td className="group-cell">
                  <div className="group-name">{group.groupName}</div>
                </td>
                {!compact && (
                  <td className="speakers-cell">
                    <div className="speakers-list">
                      {getGroupSpeakers(group.groupId).map((speaker) => (
                        <div key={speaker.role} className="speaker-item">
                          <span className="speaker-role">
                            {t(`Home.${speaker.role}`)}
                          </span>
                          <span className="speaker-name">
                            {speaker.name || t("Home.NoSpeaker")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                )}
                <td className="points-cell">
                  <input
                    type="number"
                    value={group.points || 0}
                    onChange={(e) =>
                      updatePlacement(
                        group.groupId,
                        "points",
                        Number(e.target.value)
                      )
                    }
                    className="points-input"
                    min="0"
                    max="100"
                    step="0.5"
                  />
                </td>
                <td className={`notes-cell ${compact ? "compact-notes" : ""}`}>
                  {compact ? (
                    <div className="compact-notes-container">
                      <div
                        className="notes-indicator"
                        title={group.notes || t("Home.AddNotes")}
                      >
                        {group.notes ? "📝" : "➕"}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="table-notes-preview"
                      title={group.notes || t("Home.AddNotes")}
                    >
                      {group.notes
                        ? group.notes.length > 50
                          ? `${group.notes.substring(0, 50)}...`
                          : group.notes
                        : t("Home.AddNotes")}
                    </div>
                  )}
                </td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button
                      onClick={() => {
                        const newPlacement = Math.max(1, group.placement - 1);
                        updatePlacement(
                          group.groupId,
                          "placement",
                          newPlacement
                        );
                      }}
                      disabled={group.placement === 1}
                      className="move-button move-up"
                      title={t("Home.MoveUp")}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => {
                        const newPlacement = Math.min(4, group.placement + 1);
                        updatePlacement(
                          group.groupId,
                          "placement",
                          newPlacement
                        );
                      }}
                      disabled={group.placement === 4}
                      className="move-button move-down"
                      title={t("Home.MoveDown")}
                    >
                      ↓
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes Section */}
      <div className="placement-notes-section">
        <h3>{t("Home.Notes")}</h3>
        <div className="notes-grid">
          {sortedPlacements.map((group) => (
            <div key={group.groupId} className="group-notes-item">
              <div className="group-notes-header">
                <div
                  className="group-badge"
                  style={{
                    backgroundColor: getPlacementColor(group.placement),
                  }}
                >
                  {group.placement}
                </div>
                <div className="group-notes-title">{group.groupName}</div>
              </div>
              <textarea
                value={group.notes || ""}
                onChange={(e) =>
                  updatePlacement(group.groupId, "notes", e.target.value)
                }
                className="group-notes-textarea"
                placeholder={t("Home.AddNotes")}
                rows={3}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="placement-summary">
        <h3>{t("Home.PlacementSummary")}</h3>
        <div className="summary-grid">
          {sortedPlacements.map((group) => (
            <div key={group.groupId} className="summary-item">
              <div
                className="summary-badge"
                style={{ backgroundColor: getPlacementColor(group.placement) }}
              >
                {group.placement}
              </div>
              <div className="summary-details">
                <div className="summary-group">{group.groupName}</div>
                <div className="summary-points">
                  {group.points || 0} {t("Home.Points")}
                </div>
                {compact && group.notes && (
                  <div className="summary-notes" title={group.notes}>
                    💬{" "}
                    {group.notes.length > 30
                      ? `${group.notes.substring(0, 30)}...`
                      : group.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacementTable;
