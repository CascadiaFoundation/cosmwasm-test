import type { NextPage } from 'next'
import { withMetadata } from 'utils/layout'

const HomePage: NextPage = () => {
  return (
    <section className="px-8 pt-4 pb-16 mx-auto space-y-8 max-w-4xl">
      <div className="flex justify-center items-center py-8 max-w-xl text-5xl font-extrabold">Cascadia Tools</div>
      <h1 className="font-heading text-4xl font-bold">Welcome!</h1>
      <p className="text-xl">
        CascadiaTools is a Swiss Army knife that helps you build on cascadiad by providing smart contract front ends. We
        call these front-end apps <b>Smart Contact Dashboards</b>.
      </p>

      <br />

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Smart Contract Dashboard</h2>
          <p className="text-dark/75">
            deploy, initialize, execute message and query. can do any thing related with smart contract
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Something Cool</h2>
          <p className="text-dark/75">Message signature and verification etc ...</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Adding Value</h2>
          <p className="text-dark/75">explore various references</p>
        </div>
      </div>
    </section>
  )
}

export default withMetadata(HomePage, { center: false })
