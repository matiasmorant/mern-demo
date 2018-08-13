import React, { Component } from "react";
import styled from "styled-components";
import { smoothSet } from "./utils.js";

const Selector = styled.div`
  position: relative;
  display: inline-block;
`;
const Searchbox = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  background: ${props => props.theme.secondary};
  padding-left: 5px;
  button,
  input,
  img,
  .top-icon-container {
    color: ${props => props.theme.primary};
    background: none;
    border: none;
    outline: none;
  }
  button {
    padding: 0px;
    width: 14px;
  }
  .top-icon-container {
    width: 37px;
    height: 100%;
    padding: 2px 5px;
    display: flex;
    align-items: center;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  input {
    width: calc(100% - 37px - 14px);
  }
`;
const Dropdown = styled.div`
  display: block;
  position: absolute;
  width: 100%;
  height: ${props => (props.show ? "400px" : "0px")};
  overflow: auto;
  ${props => props.theme.shadow.low} ${props => props.theme.transition};
`;
const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  background: ${props => (props.highlighted ? "#ddd" : "#fff")};
  padding: 5px 10px 5px 10px;
  transition: unset;
  :hover {
    background: ${props => (props.highlighted ? "#ddd" : "#eee")};
  }

  img {
    width: 14px;
    margin-right: 5px;
    height: auto;
    flex-shrink: 0px;
  }
  div {
    text-align: left;
    height: auto;
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
Searchbox.defaultProps = defaultProps;
Dropdown.defaultProps = defaultProps;
DropdownItem.defaultProps = defaultProps;

class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropdown: false,
      selectedOption: -1,
      text: ""
    };
    this.optionComponents = [];
  }
  closeDropdown = index => {
    this.setState({
      selectedOption: index,
      text: this.props.options[index] || "",
      showDropdown: false
    });
  };
  changeSelectedOption = (index, text) => {
    this.setState({
      selectedOption: index,
      text: text || this.props.options[index] || ""
    });
    this.props.onOptionChange(this.props.options[index]);
  };
  handleTextChange = text => {
    const trimmed = text.trim();
    const index = trimmed
      ? this.props.options.findIndex(option =>
          option.toUpperCase().startsWith(trimmed.toUpperCase())
        )
      : -1;
    this.changeSelectedOption(index, text);
  };
  handleOptionSelection = index => {
    this.closeDropdown(index);
    this.props.onOptionChange(this.props.options[index]);
  };
  handleKeyDown = event => {
    const { key } = event;
    const { selectedOption } = this.state;
    if (key === "Enter" || key === "Escape") {
      this.closeDropdown(selectedOption);
      this.input.blur();
    } else if (
      key === "ArrowDown" &&
      selectedOption + 1 < this.optionComponents.length
    ) {
      this.changeSelectedOption(selectedOption + 1);
    } else if (key === "ArrowUp" && selectedOption > 0) {
      this.changeSelectedOption(selectedOption - 1);
    }
  };
  componentDidUpdate() {
    const { selectedOption } = this.state;
    if (selectedOption >= 0) {
      const { offsetTop, offsetHeight } = this.optionComponents[selectedOption];
      const { scrollTop, offsetHeight: scrollHeight } = this.dropdown;
      const offsetBottom = offsetTop + offsetHeight;
      const scrollBottom = scrollTop + scrollHeight;
      if (offsetTop < scrollTop || offsetBottom > scrollBottom) {
        smoothSet({
          comp: this.dropdown,
          propName: "scrollTop",
          final: offsetTop - scrollHeight / 2,
          duration: 300
        });
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.options !== nextProps.options) {
      return true;
    }
    if (this.state !== nextState) {
      return true;
    }
    return false;
  }
  render() {
    return (
      <Selector {...this.props}>
        <Searchbox>
          <button onFocus={() => this.input.focus()}>
            <i className="fa fa-caret-down" />
          </button>
          <div className="top-icon-container">
            <img
              alt=""
              src={
                this.props.icons[this.state.selectedOption] ||
                this.props.defaultIcon
              }
            />
          </div>
          <input
            ref={input => {
              this.input = input;
            }}
            placeholder={this.props.default}
            onFocus={() => this.setState({ showDropdown: true })}
            onBlur={() => this.closeDropdown(this.state.selectedOption)}
            onChange={e => {
              this.handleTextChange(e.target.value);
            }}
            onKeyDown={this.handleKeyDown}
            value={
              this.state.showDropdown
                ? this.state.text
                : this.props.options[this.state.selectedOption] || ""
            }
          />
        </Searchbox>
        <Dropdown
          innerRef={e => (this.dropdown = e)}
          show={this.state.showDropdown}
        >
          {this.props.options.map((c, i) => (
            <DropdownItem
              innerRef={e => (this.optionComponents[i] = e)}
              key={i}
              highlighted={i === this.state.selectedOption}
              onMouseDown={e => {
                this.handleOptionSelection(i);
              }}
            >
              <img alt="" src={this.props.icons[i]} />
              <div>{c}</div>
            </DropdownItem>
          ))}
        </Dropdown>
      </Selector>
    );
  }
}

Select.defaultProps = {
  default: "Search...",
  defaultIcon: "",
  options: [],
  icons: [],
  onOptionChange: option => {}
};

export default Select;
