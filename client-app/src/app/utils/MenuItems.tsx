import { type MenuProps } from "antd";
import { PictureOutlined, ReadOutlined, TableOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group",
  style?: React.CSSProperties
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    style,
  } as MenuItem;
}

export const items: MenuProps["items"] = [
  getItem(<NavLink to={"/"}>Dashboard</NavLink>, "/", <TableOutlined />),
  getItem(
    "İÇERİK",
    "icerik",
    null,
    [
      getItem("Haber Yönetimi", "haber-yonetimi", <ReadOutlined />, [
        getItem(<NavLink to={"/haberler"}>Tümünü Listele</NavLink>, "haberler"),
        getItem(<NavLink to={"/haberler/yeni-ekle"}>Yeni Ekle</NavLink>, "haberler/yeni-ekle"),
      ]),
      getItem("Makale Yönetimi", "makale-yonetimi", <ReadOutlined />, [
        getItem(<NavLink to={"/makaleler"}>Tümünü Listele</NavLink>, "makaleler"),
        getItem(<NavLink to={"/makaleler/yeni-ekle"}>Yeni Ekle</NavLink>, "makaleler/yeni-ekle"),
        getItem("Kategoriler", "kategoriler", <ReadOutlined />, [
          getItem(
            <NavLink to={"/makaleler/kategoriler"}>Tümünü Listele</NavLink>,
            "makaleler/kategoriler"
          ),
          getItem(
            <NavLink to={"/makaleler/kategoriler/yeni-ekle"}>Yeni Ekle</NavLink>,
            "makaleler/kategoriler/yeni-ekle"
          ),
        ]),
      ]),
      getItem("Toplanma Alanları", "toplanma-alanlari-yonetimi", <ReadOutlined />, [
        getItem(<NavLink to={"/toplanma-alanlari"}>Tümünü Listele</NavLink>, "toplanma-alanlari"),
        getItem(
          <NavLink to={"/toplanma-alanlari/yeni-ekle"}>Yeni Ekle</NavLink>,
          "toplanma-alanlari/yeni-ekle"
        ),
      ]),
      getItem("Anasayfa Galeriler", "anasayfa-galeriler", <PictureOutlined />, [
        getItem(<NavLink to={"/deprem-galeri"}>Deprem Galeri</NavLink>, "deprem-galeri"),
        getItem(<NavLink to={"/pandemi-galeri"}>Pandemi Galeri</NavLink>, "pandemi-galeri"),
        getItem(
          <NavLink to={"/kisla-mucadele-galeri"}>Kışla Mücadele Galeri</NavLink>,
          "kisla-mucadele-galeri"
        ),
      ]),
    ],
    "group"
  ),
];
