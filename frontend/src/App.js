import React, { Component } from "react";
import SearchBar from "./SearchBar.js";
import PersonCard from "./PersonCard.js";
import styled, { ThemeProvider } from "styled-components";

const theme = {
  primary: "#477a7e",
  secondary: "#8acbd6",
  titleColor: "#4e4e4e",
  transition: "transition: all 0.3s ease-in-out;",
  shadow: {
    low: "box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);",
    high:
      "box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);",
    veryHigh:
      "box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);"
  }
};

const AppContainer = styled.div`
  text-align: center;
  height: 100vh;
  * {
    box-sizing: border-box;
  }
  .searchbar {
    height: 50px;
  }
  .people-container {
    height: calc(100% - 50px);
    overflow: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    padding: 10px 0px;
  }
`;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      people: [],
      name: "",
      country: ""
    };
    this.lastUpdate = 0;
  }
  makeQuery = filters => {
    Object.assign(this.state, filters); // I don't want to trigger an update yet, let's wait for the results.
    const queryTime = Date.now();
    setTimeout(() => {
      if (this.lastUpdate < queryTime) {
        this.lastUpdate = Date.now();
        fetch(
          `/graphql?query={people(
            name: "${this.state.name || ""}",
            origin: "${this.state.country || ""}")
            {first_name last_name photo email gender origin}}&raw`
        )
          .then(res => res.json())
          .then(json => {
            this.setState({ people: json.data.people });
          });
      }
    }, 500);
  };
  componentDidMount = () => {
    this.makeQuery({});
  };
  render() {
    return (
      <ThemeProvider theme={theme}>
        <AppContainer>
          <SearchBar className="searchbar" onFilterChange={this.makeQuery} />
          <div className="people-container">
            {this.state.people.map((person, i) => (
              <PersonCard
                key={i}
                first_name={person.first_name}
                last_name={person.last_name}
                photo={person.photo}
                email={person.email}
                gender={person.gender}
                origin={person.origin}
              />
            ))}
          </div>
        </AppContainer>
      </ThemeProvider>
    );
  }
}
export default App;
