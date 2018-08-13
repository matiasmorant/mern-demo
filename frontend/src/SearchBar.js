import React, { Component } from "react";
import styled from "styled-components";
import Select from "./Select.js";
import Logo from "./Logo.js";
import countryNames from "./country-names";
import { widthLessThan } from "./utils.js";

const SearchBarContainer = styled.div`
  position: sticky;
  top: 0px;
  display: flex;
  background: ${props => props.theme.primary};
  padding: ${props => (props.isFocused ? "0px" : "10px")};
  align-items: stretch;
  ${props => props.theme.shadow.high} &, > *, .spacer {
    ${props => props.theme.transition};
  }
  > svg {
    width: ${props => (props.isFocused ? "0px" : "100px")};
    margin-right: ${props => (props.isFocused ? "0px" : "10px")};
    ${widthLessThan(500)`
      width: 0px;
      margin-right: 0px;
    `};
  }
  ${widthLessThan(350)`
    padding: ${props => (props.isFocused ? "0px" : "5px")};
  `};
`;
const SearchBox = styled.div`
  display: flex;
  border-radius: 0px 15px 15px 0px;
  width: 100%;
  font-size: 12px;
  ${props => props.theme.shadow.low}
  &:hover {
    ${props => props.theme.shadow.veryHigh}
  }
  > .person-selector{
    display: flex;
    width: calc(100% - 180px);
    > input {
      outline: none;
      border: none;
      flex-grow: 1;
      font-family: 'Roboto', sans-serif;
      height: 100%;
    }
    > button {
      display: inline-block;
      border: none;
      background: #fff;
      color: ${props => (props.isFocused ? props.theme.primary : "#ccc")};
      height: 100%;
      outline: none;
    }
  }
  > .country-selector{
    height: 100%;
    width: 180px;
  }
  > .spacer {
    background: ${props => props.theme.secondary};
    width: ${props => (props.isFocused ? "0px" : "15px")};
    border-radius: ${props => (props.isFocused ? "0px" : "0px 15px 15px 0px")};
  }
  ${widthLessThan(500)`
    border-radius: 0px;
    > .spacer {
      width: 0px;
      border-radius: 0px;
    }    
  `}  

  ${widthLessThan(350)`
    flex-direction: column;
    > .person-selector, > .country-selector{
      height: 50%;
      width: 100%;
    }
  `}  
}
`;
const defaultProps = {
  theme: {
    primary: "#000",
    secondary: "#888",
    shadow: {
      low: "box-shadow: none;",
      high: "box-shadow: none;",
      veryHigh: "box-shadow: none;"
    }
  }
};
SearchBox.defaultProps = defaultProps;
SearchBarContainer.defaultProps = defaultProps;

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.isFocused !== nextState.isFocused) {
      return true;
    }
    return false;
  }
  render() {
    return (
      <SearchBarContainer isFocused={this.state.isFocused} {...this.props}>
        <Logo />
        <SearchBox isFocused={this.state.isFocused}>
          <div className="person-selector">
            <button>
              <i className="fa fa-search" />
            </button>
            <input
              placeholder="Search..."
              onFocus={() => this.setState({ isFocused: true })}
              onBlur={() => this.setState({ isFocused: false })}
              onChange={event =>
                this.props.onFilterChange({ name: event.target.value })
              }
            />
          </div>
          <Select
            className="country-selector"
            default="All Countries"
            defaultIcon="https://noto-website-2.storage.googleapis.com/emoji/emoji_u1f30f.png"
            options={Object.keys(countryNames)}
            icons={Object.values(countryNames)}
            onOptionChange={country => {
              this.props.onFilterChange({ country });
            }}
          />
          <div className="spacer" />
        </SearchBox>
      </SearchBarContainer>
    );
  }
}

SearchBar.defaultProps = {
  onFilterChange: event => {}
};

export default SearchBar;
