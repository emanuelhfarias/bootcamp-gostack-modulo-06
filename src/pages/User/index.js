import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 1,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const { page } = this.state;
    const user = navigation.getParam('user');
    this.setState({ loading: true });
    const response = await api.get(`/users/${user.login}/starred?page=${page}`);
    this.setState({ stars: response.data, loading: false });
  }

  loadMore = async () => {
    const { stars, page } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    this.setState({ loading: true, page: page + 1 });
    const response = await api.get(
      `/users/${user.login}/starred?page=${page + 1}`
    );
    this.setState({
      stars: [...stars, ...response.data],
      loading: false,
    });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading } = this.state;
    const user = navigation.getParam('user');
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        <Stars
          data={stars}
          onEndReachedThreshold={0.2}
          onEndReached={this.loadMore}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
        {loading && <ActivityIndicator />}
      </Container>
    );
  }
}
