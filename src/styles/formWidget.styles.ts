import { setWidgetTheme } from "./setWidgetTeme";

export const formWidgetStyles = `
.container {
    border: 1px solid lightgray;
    border-radius: 10px;
    padding: 20px;
    margin: 20px;
    width: fit-content;
}
.form {
  max-width: 100%;
}

 ${setWidgetTheme()}
`;
