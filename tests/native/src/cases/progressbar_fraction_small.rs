use relm4::prelude::*;

pub struct ProgressbarFractionSmall;

#[relm4::component(pub)]
impl SimpleComponent for ProgressbarFractionSmall {
    type Init = ();
    type Input = ();
    type Output = ();

    view! {
        gtk::ProgressBar {
            set_fraction: 0.1,
        }
    }

    fn init(_: (), root: Self::Root, _sender: ComponentSender<Self>) -> ComponentParts<Self> {
        let model = Self;
        let widgets = view_output!();
        ComponentParts { model, widgets }
    }
}
