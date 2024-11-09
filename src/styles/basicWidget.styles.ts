import { setWidgetTheme } from "./setWidgetTeme";

export const basicWidgetStyles = `
.container {
    border: 1px solid lightgray;
    background-color: #ffff;
    padding: 20px;
    margin: 20px;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.heading {
    font-size: 22px;
    font-weight: 500;
    display: flex;
    width: 100%;
    justify-content: space-between;
}

.button__group {
    display: flex;
    gap: 1rem;
}
    
.inputField {
    font-size: 16px;
}
.ant-input-number, .ant-input-number-input {
  width: 100% ;
}
  ${setWidgetTheme()}
`;


