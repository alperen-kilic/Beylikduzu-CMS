import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Col, Form, FormProps, Input, Row } from "antd";
import { observer } from "mobx-react-lite";
import { Area } from "../../models/area";
import TextArea from "antd/es/input/TextArea";
import { AdvancedMarker, Map, MapMouseEvent, useMap } from "@vis.gl/react-google-maps";
import { useStore } from "../../stores/store";
import LoadingComponent from "../../layout/LoadingComponent";

type LatLngLiteral = { lat: number; lng: number };

const ToplanmaAlaniEdit = observer(() => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const [form] = Form.useForm();
  const [area, setArea] = useState<Area>();
  const map = useMap();
  const [selectedLocation, setSelectedLocation] = useState({ lat: 41.001963, lng: 28.642102 });

  const { areasStore } = useStore();
  const { loadArea, loadingInitial, loading, updateArea, createArea, clearSelectedArea } =
    areasStore;

  useEffect(() => {
    if (id) {
      loadArea(Number(id)).then((area) => {
        form.setFieldsValue(area);
        setSelectedLocation({ lat: parseFloat(area!.lat), lng: parseFloat(area!.lng) });
        setArea(area);
      });
    }

    return () => clearSelectedArea();
  }, [clearSelectedArea, form, id, loadArea]);

  const onFinish: FormProps["onFinish"] = (values) => {
    if (id) {
      values.lng = values.lng.toString();
      values.lat = values.lat.toString();
      updateArea(values);
    } else {
      console.log(values);
      values.lng = values.lng.toString();
      values.lat = values.lat.toString();
      createArea(values);
    }
  };

  useEffect(() => {
    map?.panTo(selectedLocation);
  }, [map, selectedLocation]);

  const handleMapClick = (e: MapMouseEvent) => {
    const { lat, lng } = e.detail.latLng as LatLngLiteral;
    setSelectedLocation({ lat, lng });
    form.setFieldsValue({ lat, lng });
  };

  if (loadingInitial) return <LoadingComponent />;

  return (
    <Form
      initialValues={area}
      form={form}
      layout="vertical"
      onFinish={onFinish}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
    >
      <Form.Item name={"id"} noStyle>
        <Input type="hidden" />
      </Form.Item>
      <Form.Item
        label="Toplanma Alanı Adı"
        name="title"
        rules={[{ required: true, message: "Ad boş bırakılamaz!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Adres"
        name={"address"}
        rules={[{ required: true, message: "Adres alanı boş bırakılamaz!" }]}
      >
        <TextArea rows={3} />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Enlem"
              name={"lat"}
              rules={[{ required: true, message: "Enlem alanı boş bırakılamaz!" }]}
            >
              <Input
                onChange={(e) =>
                  setSelectedLocation((prev) => {
                    if (!e.target.value || isNaN(Number(e.target.value))) return prev;
                    return { ...prev, lat: parseFloat(e.target.value) };
                  })
                }
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Boylam"
              name={"lng"}
              rules={[{ required: true, message: "Boylam alanı boş bırakılamaz!" }]}
            >
              <Input
                onChange={(e) =>
                  setSelectedLocation((prev) => {
                    if (!e.target.value || isNaN(Number(e.target.value))) return prev;
                    return { ...prev, lng: parseFloat(e.target.value) };
                  })
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item style={{ marginBottom: 0 }}>
        <Map
          mapId={"toplanma-alanlari-edit"}
          style={{ width: "100%", height: "350px" }}
          defaultCenter={selectedLocation}
          defaultZoom={18}
          gestureHandling={"cooperative"}
          onClick={handleMapClick}
        >
          <AdvancedMarker position={selectedLocation} />
        </Map>
      </Form.Item>
      <Form.Item style={{ marginTop: "2rem" }}>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Ekle
        </Button>
      </Form.Item>
    </Form>
  );
});

export default ToplanmaAlaniEdit;
