import styled from 'styled-components';

const CardWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const CardBody = styled.div`
  flex: 1;
  padding: 0;
  border-radius: 0 20px 20px 0;
`;

const CardContent = styled.div`
  flex: 1;
  min-height: 80px;
`;

const CardHeader = styled.div`
  border-radius: 20px 0 0 20px;
  width: 30px;
  align-self: stretch;
  position: relative;
`;

const CardHeaderText = styled.div`
  text-align: center;
  font: normal normal bold 12px/15px Montserrat;
  letter-spacing: 0px;
  color: #08333c;
  text-transform: uppercase;
  height: 30px;
  margin-top: 10px;
  margin-left: 15px;

  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  transform: rotate(-90deg);
  direction: rtl;
`;

function Card(props) {
  return (
    <>
      <CardWrapper>
        <CardHeader style={props.headerStyle}>
          <CardHeaderText style={props.headerTextStyle}>
            {props.headerText}
          </CardHeaderText>
        </CardHeader>
        <CardBody style={props.bodyStyle}>
          <CardContent>{props.children}</CardContent>
        </CardBody>
      </CardWrapper>
    </>
  );
}

export default Card;
