import { ContactMessage } from "../../database/models/ContactMessage";
import { Event } from "../../database/models/Event";
import { GalleryImage } from "../../database/models/GalleryImage";
import { TeamMember } from "../../database/models/TeamMember";
import { Video } from "../../database/models/Video";

export const getDashboardStats = async () => {
  const [
    totalEvents,
    publishedEvents,
    galleryImages,
    videos,
    teamMembers,
    unreadMessages,
  ] = await Promise.all([
    Event.countDocuments({ isDeleted: false }),
    Event.countDocuments({ isDeleted: false, status: "published" }),
    GalleryImage.countDocuments({ isDeleted: false }),
    Video.countDocuments({ isDeleted: false }),
    TeamMember.countDocuments({ isDeleted: false }),
    ContactMessage.countDocuments({ isDeleted: false, status: "unread" }),
  ]);

  return {
    totalEvents,
    publishedEvents,
    galleryImages,
    videos,
    teamMembers,
    unreadMessages,
  };
};
