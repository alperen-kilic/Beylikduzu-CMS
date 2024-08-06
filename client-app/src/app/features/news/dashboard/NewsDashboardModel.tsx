import type { TableProps } from "antd";
interface DashboardNewsItem {
  id: string;
  title: string;
}

export const dashboardColumns: TableProps["columns"] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    render: (text) => <p>{text}</p>,
    align: "center",
  },
  {
    title: "Başlık",
    dataIndex: "title",
    key: "title",
    render: (text) => <p>{text}</p>,
  },
];

export const data: DashboardNewsItem[] = [
  {
    id: "1",
    title: "Kadınlara Özel Kendini Koruma Teknikleri Eğitimi",
  },
  {
    id: "2",
    title: "5 Yıllık Stratejik Faaliyet Raporu Oy Birliğiyle Kabul Edildi",
  },
  {
    id: "3",
    title: "Yeni Dönemin İlk Meclis Toplantısı Yapıldı",
  },
  {
    id: "4",
    title: "Binlerce Kişi Hayırlı İftar Sofrası'nda Oruçlarını Açtı",
  },
  {
    id: "5",
    title: "Başkan Çalık Mazbatasını Aldı",
  },
];
