import { Card } from "antd";
import React from "react";
import { FieldData } from "src/types/interfaces";
import styles from "./Card.module.scss";

interface CardPreviewProps {
  fieldData: FieldData;
}

const CardPreview: React.FC<CardPreviewProps> = ({ fieldData }) => {
  const title = fieldData.data
    .filter((item) => item.setAsTitle)
    .map((obj) => obj.value)
    .join(" ");
  const description = fieldData.data
    .filter((item) => item.setAsDescription)
    .map((obj) => obj.value)
    .join(" ");
  const extra = fieldData.data
    .filter((item) => item.setAsExtra)
    .map((obj) => obj.value)
    .join(" ");

  return (
    <div className={styles.card__container}>
      <Card
        hoverable
        style={{ width: 440 }}
        cover={
          <img
            alt="example"
            // src={"https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"}
            src={extra}
          />
        }
      >
        <Card.Meta
          //   title={fieldData.card?.title.join(" ")}
          title={title}
          //   description={fieldData.card?.description.join(" ")}
          description={description}
        />
      </Card>
    </div>
  );
};

export default CardPreview;
