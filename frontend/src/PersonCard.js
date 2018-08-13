import React, { Component } from "react";
import styled, { css } from "styled-components";

function widthLessThan(width) {
  return (...args) =>
    css`
      @media screen and (max-width: ${width}px) {
        ${css(...args)};
      }
    `;
}

const PersonCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  width: 330px;
  height: 95px;
  margin: 2px;
  font-family: "Roboto", sans-serif;
  ${props => props.theme.shadow.low} ${props =>
    props.theme.transition}
  &:hover {
    ${props => props.theme.shadow.veryHigh};
  }
  ${widthLessThan(330)`
    flex-direction: column;
    width: 270px;
    height: 155px;
  `} >.card-pic + div {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  h3,
  table {
    padding: 5px 2px;
    width: 100%;
  }

  table {
    flex: 1 1 auto;
    font-size: 12px;
    * {
      padding: 0px;
    }
    td {
      text-align: left;
    }
    .key {
      font-weight: bold;
      color: #4e4e4e;
      width: 47px;
    }
  }

  h3 {
    background: ${props => props.theme.secondary};
    margin: 0px;
    color: ${props => props.theme.titleColor};
    border-top-right-radius: 10px;
    font-size: 14px;
    ${widthLessThan(330)`
      border-top-right-radius: 0px;
    `};
  }
  .card-pic {
    display: flex;
    padding: 5px;
    align-items: center;
    width: 60px;
    height: 100%;
    background: ${props => props.theme.primary};
    border-radius: 10px 0px 0px 10px;
    ${widthLessThan(330)`
      width: 100%;
      height: 60px;
      border-radius: 10px 10px 0px 0px;
    `} > img {
      margin: auto;
      background: white;
      border-radius: 25px;
      width: 50px;
      height: 50px;
    }
  }
`;
PersonCardContainer.defaultProps = {
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

class PersonCard extends Component {
  render() {
    const { first_name, last_name, photo, email, gender, origin } = this.props;
    return (
      <PersonCardContainer>
        <div className="card-pic">
          <img src={photo} alt="" />
        </div>
        <div>
          <h3>
            {first_name} {last_name}
          </h3>
          <table>
            <tbody>
              <tr>
                <td className="key">Email:</td>
                <td>{email}</td>
              </tr>
              <tr>
                <td className="key">Gender:</td>
                <td>{gender}</td>
              </tr>
              <tr>
                <td className="key">Origin:</td>
                <td>{origin}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </PersonCardContainer>
    );
  }
}

export default PersonCard;
