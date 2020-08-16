import Head from 'next/head';

const Index = () => (
    <div>
        <Head>
            <title>Index Page</title>
            <meta name="description" content="This is a description of the Index Page" />
        </Head>
        <div style={{padding: '0px 30px', fontSize: '15px', height: '100%', color: '#222'}}>
            <p>Welcome to the Index :)</p>
        </div>
    </div>
)

export default Index;