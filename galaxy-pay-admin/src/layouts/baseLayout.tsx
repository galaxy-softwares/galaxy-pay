import React, { FC } from 'react'
import { Layout, Card } from 'antd';
import "./index.less";
import LeftSider from './leftSider';
import Headers from "./header";
const { Content } = Layout;

const BaseLayout: FC = ({children}) => {
    return (
        <Layout>
            <LeftSider />
            <Layout>
                <Headers />
                <Content>
                    <div className="content">
                        <Card>
                            {children}
                        </Card>
                    </div>
                </Content>
            </Layout>
        </Layout>
    )
}

export default BaseLayout
