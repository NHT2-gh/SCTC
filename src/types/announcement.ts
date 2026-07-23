export interface Announcement {
  title: string;
  message: string;
  start_time: string;
  end_time: string;
  display: boolean;
  type: AnnouncementType;
}

export enum AnnouncementType {
  info = "info",
  open_time = "open_time",
  promotion = "promotion",
}

export const AnnouncementTypeMap = {
  [AnnouncementType.info]: "Thông tin",
  [AnnouncementType.open_time]: "Thời gian mở cửa",
  [AnnouncementType.promotion]: "Khuyến mãi",
};
