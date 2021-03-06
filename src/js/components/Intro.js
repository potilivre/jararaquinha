import React, {Component} from "react";
import {current_events} from "../api/API";
import {connect} from "react-redux";
import {setEvent} from "../reducers";
import config from "../config"
import '../index.css';
import Alert from "./utils/Alert";
import Animation from "./utils/Animation";


class Intro extends Component {
    static path = "check";

    static navigationOptions = {
        title: config.window_title,
    };

    constructor(props) {
        super(props);
        this.state = {
            event: null,
            busy: true,
            error: null,
            data: null
        }
    }

    componentDidMount() {
        if (this.state.busy) {
            current_events().then(response => {
                console.log('data', response);
                this.setState({busy: false, data: response.data});
                if (response.data.length === 1) {
                    this.selectEvent(response.data[0]);
                }
            }).catch(error => {
                if (error.response) {
                    console.log(error.response);
                    this.setState({error: 'Falha ao conectar: ' + error.response.statusText})
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                    this.setState({error: 'Erro: o servidor não respondeu apropriadamente.'});
                } else {
                    // Something happened in setting up the request that triggered an Error
                    this.setState({error: 'Requisição inválida.'});
                    console.log('Error', error.message);
                }
                console.log(error.config);
            }).finally(() => {
                this.setState({busy: false});
            });
        }
    }

    selectEvent(event) {
        const {setEvent} = this.props;
        setEvent(event);
    }

    renderEvents() {
        const lista = [];
        this.state.data.forEach((event, i) => {
            lista.push(<div key={event.id}>
                <p>
                    <button className={"btn btn-secondary"}
                            onClick={() => this.selectEvent.bind(this)(event)}>{event.name}</button>
                </p>
            </div>)
        });

        // console.log(this.state.data);
        if (lista.length > 0)
            return <div>
                <p>Selecione o evento: </p>

                <div className={'lista'}>
                    <div>
                        {lista}
                    </div>
                </div>
            </div>;
        return <Animation><Alert type="info"><h5>Não há nenhum evento ativo no momento.</h5></Alert></Animation>;
    }

    render() {
        return (
            <div>
                {
                    this.state.busy ?
                        <div className="spinner-border m-5 text-warning" role="status">
                            <span className="sr-only">Carregando...</span>
                        </div>
                        :
                        this.state.error ? <Alert type="danger">{this.state.error}</Alert> :
                            this.props.event == null ?
                                <Animation>
                                    {this.renderEvents()}
                                </Animation>
                                :
                                <Animation>
                                    <h4 key={"title"} className={"title"}>Bem vindo(a) ao {this.props.event.name} </h4>
                                    <p>
                                        <button className={'btn btn-outline-success btn-lg'} key={"checkin"}
                                                onClick={() => this.props.navigation.navigate('Camera', {check: 'in'})}>Realizar
                                            Check-in
                                        </button>
                                    </p>
                                    <p>
                                        <button className={'btn btn-outline-danger btn-lg'} key={"checkout"}
                                                onClick={() => this.props.navigation.navigate('Camera', {check: 'out'})}>Realizar
                                            Check-out
                                        </button>
                                    </p>
                                </Animation>
                }
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {event: state.event};
};

function mapDispatchToProps(dispatch) {
    return {
        setEvent: event_id => dispatch(setEvent(event_id))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Intro)