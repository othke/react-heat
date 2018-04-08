import React from 'react'
import rainbow from './utils'

class Heat extends React.Component {

    componentDidMount() {
        rainbow()

    }

    render() {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        )
    }
}

export default Heat