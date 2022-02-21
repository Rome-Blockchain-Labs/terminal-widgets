import tw, { styled } from 'twin.macro'

export const ToggleSwitch = () => {
  return (
    <SwitchContainer>
      <input type="checkbox" id="togBtn" />
      <div className="slider round">
        <span className="on">ON</span>
        <span className="off">OFF</span>
      </div>
    </SwitchContainer>
  )
}

const SwitchContainer = styled.label`
  ${tw`relative inline-block w-[48px] h-[27px]`}

  > input {
    ${tw`hidden`}
  }

  > div {
    ${tw`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-[50px] before:rounded-[50px] bg-[#03283D] transition duration-300`}

    &:before {
      position: absolute;
      content: '';
      height: 18px;
      width: 18px;
      left: 2px;
      bottom: 4px;
      background-color: #cdcdcd;
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }
  }

  > input:checked + .slider:before {
    background-color: #19a99d;
  }
  > input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  > input:checked + div:before {
    ${tw`transform translate-x-[26px]`}
  }
  > input:checked + .slider > span {
    ${tw`transform -translate-x-3 `}
  }

  > div {
    span {
      ${tw` transition duration-500 ease-in-out text-white absolute transform translate-x-1/2 translate-y-1/2 right-[15px] bottom-3  text-[10px]`}
    }
    .on {
      ${tw`hidden`}
    }
  }
  > input:checked + .slider .on {
    ${tw`block`}
  }
  > input:checked + .slider .off {
    ${tw`hidden`}
  }
`
