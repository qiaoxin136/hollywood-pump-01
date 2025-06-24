import { useEffect, useState, ChangeEvent } from "react";
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";


import {
  Input,
  Flex,
  Button,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  ThemeProvider,
  Theme,
  Divider,
  ScrollView,
  Tabs,
  SelectField,
  CheckboxField,
  // TextField,
} from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
//import { IconLayer } from "@deck.gl/layers/typed";
import { MVTLayer } from "@deck.gl/geo-layers/typed";
import { TextLayer } from "@deck.gl/layers/typed";

const theme: Theme = {
  name: "table-theme",
  tokens: {
    components: {
      table: {
        row: {
          hover: {
            backgroundColor: { value: "{colors.blue.20}" },
          },

          striped: {
            backgroundColor: { value: "{colors.orange.10}" },
          },
        },

        header: {
          color: { value: "{colors.blue.80}" },
          fontSize: { value: "{fontSizes.x3}" },
          borderColor: { value: "{colors.blue.20}" },
        },

        data: {
          fontWeight: { value: "{fontWeights.semibold}" },
        },
      },
    },
  },
};

const client = generateClient<Schema>();


type DataT = {
  type: "Feature";
  id: number;
  geometry: {
    type: "Point";
    coordinates: [number, number, number];
  };
  properties: {
    track: number;
    type: string;
    status: string;
    date: string;
    time: string;
    id: string;
  };
};

type SelectOption = {
  value: string;
  label: string;
};

const AIR_PORTS =
  "https://5u4m070ki1.execute-api.us-east-1.amazonaws.com/Test/getData";





function App() {

  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

   const [date, setDate] = useState("");
  const [pumpstation, setPumpstation] = useState<string>("");
  const [status, setStatus]=useState<string>("start");
  const [top, setTop] = useState(0);
  const [bottom, setBottom] = useState(0);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

    const handleDate = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ 
      date: date,
      pumpstation: pumpstation,
      status: status,
      top: top, 
      bottom: bottom, 
      lat: lat,
      long: lng,

    });

    setDate("");
    setPumpstation("");
    setStatus(status);
    setTop(top);
    setBottom(bottom);
    setLat(0);
    setLng(0);
  }


  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <main>
       <h1>City of Hollywood Lift Station Tracking App</h1>
      <Divider orientation="horizontal" />
      <br />
       <Flex>
        <Button onClick={signOut} width={120}>
          Sign out
        </Button>
        <Button onClick={createTodo} backgroundColor={"azure"} color={"red"}>
          + new
        </Button>
        {/* <Button
          role="link"
          onClick={() =>
            openInNewTab(
              "https://washington-2-map-fixed.d2qs7f7sc8f3m1.amplifyapp.com"
            )
          }
        //onClick={() => getPlacesData()}
        >
          Map
        </Button> */}
      </Flex>
      <br />
      
    </main>
  );
}

export default App;
