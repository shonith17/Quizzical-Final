import he from "he";

function Question(props) {
  
    const answerElements = props.answers.map((item) => {
      
        const classNames = [
            item.on ? "on" : "", // Add the "on" class when item.on is true
            item.on && item.correct && props.checked ? "selected right" : "",
            item.on && !item.correct && props.checked ? "selected wrong" : "",
            !item.on && item.correct && props.checked ? "selected right not-on" : "",
            !item.on && !item.correct && props.checked ? "not-on" : ''
          ];
      
          const className = classNames.join(" ");
      
          return (
            <div
              key={item.id}
              onClick={() => props.toggle(item.id)}
              className={className}
            >
              {he.decode(item.answer)}
            </div>
        );
      });
      

  return (
    <>
      <div className="question">{he.decode(props.question)}</div>
      <div className="answers">{answerElements}</div>
      <hr />
    </>
  );
}

export default Question;
