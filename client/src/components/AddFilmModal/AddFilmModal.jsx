import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import MultipleInput from '../common/MultipleInput';
import Select from '../common/Select';
import './AddFilmModal.scss';
import { filmsOperations, filmsActions } from '../../store/films';
import getCurrentYear from '../../helpers/getCurrentYear';
import wordsWithSpaces from '../../helpers/wordsWithSpaces';

const INITIAL_STATE = Object.freeze({
  title: '',
  release_year: '',
  format: '',
  cast: [],
  validationPassed: true,
  validationMessage: '',
});

const FORMAT_OPTIONS = Object.freeze(['DVD', 'Blue Ray', 'VHS']);

class AddFilmModal extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      title: '',
      release_year: '',
      format: '',
      cast: [],
      validationPassed: true,
      validationMessage: '',
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onAddCastMember = (member) => {
    this.setState({
      cast: [...this.state.cast, member],
    });
  };

  onDeleteCastMember = (member) => {
    this.setState({
      cast: this.state.cast.filter((mem) => mem !== member),
    });
  };

  clearState = () => {
    this.setState({
      ...INITIAL_STATE,
    });
  };

  validateCastField = (value) => {
    const result = wordsWithSpaces.test(value);
    if (!result) {
      this.setState({
        validationPassed: false,
        validationMessage: 'The cast field should contain only letters!',
      });
    }
    return result;
  };

  onSubmitFrom = async (e) => {
    e.preventDefault();
    if (
      !this.state.title ||
      !this.state.release_year ||
      !this.state.format ||
      this.state.cast.length < 1
    ) {
      this.setState({
        validationPassed: false,
        validationMessage: 'Please, fill all the fields!',
      });
      return;
    }
    this.setState({
      validationPassed: true,
    });
    const { validationPassed, ...rest } = this.state;
    const res = await this.props.addFilm(rest);
    if (res) {
      this.clearState();
      this.props.onModalClose();
      this.props.requestFilms(this.props.filmRequest);
      this.props.sendNotification({
        msg: 'The film has been added successfully',
        type: 'success',
      });
    }
  };

  render() {
    return (
      <Modal
        visible={this.props.visible}
        onModalClose={this.props.onModalClose}
        title="Add new film"
        cancelButton={
          <Button text="Cancel" color="regular" onClick={this.props.onModalClose} />
        }
        actionButton={
          <Button text="Submit" color="action" type="submit" form="add-film" />
        }
      >
        <form id="add-film" className="add-film-form" onSubmit={this.onSubmitFrom}>
          <Input
            title="Title"
            name="title"
            onChange={this.onChange}
            value={this.state.title}
          />
          <Input
            title="Year"
            name="release_year"
            type="number"
            max={getCurrentYear()}
            min="1850"
            onChange={this.onChange}
            value={this.state.release_year}
          />
          <Select
            title="Format"
            name="format"
            onChange={this.onChange}
            value={this.state.format}
            options={FORMAT_OPTIONS.map((el) => {
              return {
                value: el,
                title: el,
              };
            })}
          />
          <MultipleInput
            lable="Cast"
            data={this.state.cast}
            onAddItem={this.onAddCastMember}
            onDeleteItem={this.onDeleteCastMember}
            fieldValidation={this.validateCastField}
          />
          <p
            className={`validation-message ${
              this.state.validationPassed ? 'hide' : 'show'
            }`}
          >
            {this.state.validationMessage}
          </p>
        </form>
      </Modal>
    );
  }
}

const MapStateToProps = (state) => ({
  filmRequest: state.films.filmRequest,
});

const MapDispatchToProps = {
  addFilm: filmsOperations.addFilm,
  requestFilms: filmsOperations.requestFilms,
  sendNotification: filmsActions.sendNotification,
};

export default connect(MapStateToProps, MapDispatchToProps)(AddFilmModal);
